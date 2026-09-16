import db from "@adonisjs/lucid/services/db";
import type { TransactionClientContract } from "@adonisjs/lucid/types/database";
import type { Infer } from "@vinejs/vine/types";

import Company from "#models/company";
import Contact, { ContactKind } from "#models/contact";
import Subscription from "#models/subscription";
import { CorrespondentSchema } from "#validators/subscription/representatives/contact.validator";

export type UpdateCorrespondentPayload = Infer<typeof CorrespondentSchema>;

function definedChanges(payload: UpdateCorrespondentPayload) {
	return Object.fromEntries(
		Object.entries(payload).filter(([, value]) => value !== undefined),
	) as UpdateCorrespondentPayload;
}

function hasContactValues(payload: UpdateCorrespondentPayload) {
	const { isSameAsLegal: _isSameAsLegal, ...contact } = payload;
	return Object.values(contact).some((value) => value !== null && value !== undefined);
}

export default class UpdateCorrespondentService {
	async handle(subscription: Subscription, payload: UpdateCorrespondentPayload) {
		return db.transaction(async (trx) => {
			const company = await Company.findByOrFail("subscriptionId", subscription.id, {
				client: trx,
			});
			if (!company.companyLegalAgentId) return company;

			const legalAgent = await Contact.findOrFail(company.companyLegalAgentId, { client: trx });
			const isSameAsLegal =
				legalAgent.kind === ContactKind.PERSONNE_MORALE
					? false
					: (payload.isSameAsLegal ?? legalAgent.isSameAsLegal);

			if (legalAgent.isSameAsLegal !== isSameAsLegal) {
				await legalAgent.useTransaction(trx).merge({ isSameAsLegal }).save();
			}

			if (isSameAsLegal !== false) {
				if (isSameAsLegal === true) {
					await this.#clear(company, trx);
				}
				return company;
			}

			if (!company.companyCorrespondentId && !hasContactValues(payload)) return company;

			const correspondent = company.companyCorrespondentId
				? await Contact.findOrFail(company.companyCorrespondentId, { client: trx })
				: new Contact();

			correspondent.merge(definedChanges(payload));
			this.#applyRules(correspondent);
			await correspondent.useTransaction(trx).save();

			if (!company.companyCorrespondentId) {
				await company
					.useTransaction(trx)
					.merge({ companyCorrespondentId: correspondent.id })
					.save();
			}

			return company;
		});
	}

	async #clear(company: Company, trx: TransactionClientContract) {
		if (!company.companyCorrespondentId) return;

		const correspondentId = company.companyCorrespondentId;
		await company.useTransaction(trx).merge({ companyCorrespondentId: null }).save();
		await Contact.query({ client: trx }).where("id", correspondentId).delete();
	}

	#applyRules(correspondent: Contact) {
		correspondent.kind = ContactKind.PERSONNE_PHYSIQUE;
		correspondent.legalName = null;
		correspondent.isSameAsLegal = null;
		correspondent.isSignatoryOnKbis = null;
		correspondent.authorizations = null;
	}
}
