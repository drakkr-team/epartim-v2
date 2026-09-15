import db from "@adonisjs/lucid/services/db";
import type { TransactionClientContract } from "@adonisjs/lucid/types/database";
import type { Infer } from "@vinejs/vine/types";

import Company from "#models/company";
import Contact, { ContactKind } from "#models/contact";
import Subscription from "#models/subscription";
import { UpdateAuthorizationsSchema } from "#validators/subscription/representatives/authorizations.validator";

export type UpdateAuthorizationsPayload = Infer<typeof UpdateAuthorizationsSchema>;

type AuthorizationPayload = UpdateAuthorizationsPayload["authorizations"][number];

function definedChanges(payload: AuthorizationPayload) {
	return Object.fromEntries(
		Object.entries(payload).filter(([, value]) => value !== undefined),
	) as AuthorizationPayload;
}

export default class UpdateAuthorizationsService {
	async handle(subscription: Subscription, payload: UpdateAuthorizationsPayload) {
		return db.transaction(async (trx) => {
			const company = await Company.findByOrFail("subscriptionId", subscription.id, {
				client: trx,
			});
			await this.#replace(company, payload.authorizations, trx);

			return company;
		});
	}

	async #replace(
		company: Company,
		payload: UpdateAuthorizationsPayload["authorizations"],
		trx: TransactionClientContract,
	) {
		const existing = await company
			.useTransaction(trx)
			.related("contacts")
			.query()
			.whereNotNull("authorizations")
			.orderBy("contacts.id");
		const authorizationIds: number[] = [];

		for (const [index, authorizationPayload] of payload.entries()) {
			const authorization = existing[index] ?? new Contact();

			authorization.merge(definedChanges(authorizationPayload));
			this.#applyRules(authorization);
			authorization.authorizations = authorizationPayload.authorizations ?? [];
			await authorization.useTransaction(trx).save();
			authorizationIds.push(authorization.id);
		}

		const obsoleteIds = existing.slice(payload.length).map((authorization) => authorization.id);
		await company.useTransaction(trx).related("contacts").sync(authorizationIds);

		if (obsoleteIds.length > 0) {
			await Contact.query({ client: trx }).whereIn("id", obsoleteIds).delete();
		}
	}

	#applyRules(authorization: Contact) {
		authorization.kind = ContactKind.PERSONNE_PHYSIQUE;
		authorization.legalName = null;
		authorization.isSameAsLegal = null;
		authorization.isSignatoryOnKbis = null;
	}
}
