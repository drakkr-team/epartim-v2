import db from "@adonisjs/lucid/services/db";
import type { Infer } from "@vinejs/vine/types";

import Company from "#models/company";
import Contact, { ContactKind } from "#models/contact";
import Subscription from "#models/subscription";
import { UpdateSignerSchema } from "#validators/subscription/representatives/signer.validator";

export type UpdateSignerPayload = Infer<typeof UpdateSignerSchema>;

function definedChanges(payload: UpdateSignerPayload) {
	return Object.fromEntries(
		Object.entries(payload).filter(([, value]) => value !== undefined),
	) as UpdateSignerPayload;
}

function hasValues(payload: UpdateSignerPayload) {
	return Object.values(payload).some((value) => value !== null && value !== undefined);
}

export default class UpdateSignerService {
	async handle(subscription: Subscription, payload: UpdateSignerPayload) {
		return db.transaction(async (trx) => {
			const company = await Company.findByOrFail("subscriptionId", subscription.id, {
				client: trx,
			});

			if (!company.companySignerId && !hasValues(payload)) return company;

			const signer = company.companySignerId
				? await Contact.findOrFail(company.companySignerId, { client: trx })
				: new Contact();

			signer.merge(definedChanges(payload));
			this.#applyRules(signer);
			await signer.useTransaction(trx).save();

			if (!company.companySignerId) {
				await company.useTransaction(trx).merge({ companySignerId: signer.id }).save();
			}

			return company;
		});
	}

	#applyRules(signer: Contact) {
		signer.kind = ContactKind.PERSONNE_PHYSIQUE;
		signer.legalName = null;
		signer.isSameAsLegal = null;
		signer.amundiPortalId = null;
		signer.authorizations = null;
		signer.isSignatoryOnKbis ??= null;
	}
}
