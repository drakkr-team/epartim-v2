import db from "@adonisjs/lucid/services/db";
import type { Infer } from "@vinejs/vine/types";

import Company from "#models/company";
import Contact, { ContactKind } from "#models/contact";
import Subscription from "#models/subscription";
import { UpdateLegalAgentSchema } from "#validators/subscription/representatives/legal_agent.validator";

export type UpdateLegalAgentPayload = Infer<typeof UpdateLegalAgentSchema>;

function definedChanges(payload: UpdateLegalAgentPayload) {
	return Object.fromEntries(
		Object.entries(payload).filter(([, value]) => value !== undefined),
	) as UpdateLegalAgentPayload;
}

export default class UpdateLegalAgentService {
	async handle(subscription: Subscription, payload: UpdateLegalAgentPayload) {
		return db.transaction(async (trx) => {
			const company = await Company.findByOrFail("subscriptionId", subscription.id, {
				client: trx,
			});
			const legalAgent = company.companyLegalAgentId
				? await Contact.findOrFail(company.companyLegalAgentId, { client: trx })
				: new Contact();

			legalAgent.merge(definedChanges(payload));
			this.#applyRules(legalAgent);
			await legalAgent.useTransaction(trx).save();

			if (!company.companyLegalAgentId) {
				await company.useTransaction(trx).merge({ companyLegalAgentId: legalAgent.id }).save();
			}

			return company;
		});
	}

	#applyRules(legalAgent: Contact) {
		legalAgent.amundiPortalId = null;
		legalAgent.isSignatoryOnKbis = null;
		legalAgent.authorizations = null;

		if (legalAgent.kind === ContactKind.PERSONNE_MORALE) {
			legalAgent.civility = null;
			legalAgent.firstName = null;
			legalAgent.lastName = null;
			legalAgent.phoneNumber = null;
			legalAgent.isSameAsLegal = false;
			return;
		}

		if (legalAgent.kind === ContactKind.PERSONNE_PHYSIQUE) {
			legalAgent.legalName = null;
		}
	}
}
