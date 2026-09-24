import { inject } from "@adonisjs/core";
import db from "@adonisjs/lucid/services/db";
import type { Infer } from "@vinejs/vine/types";

import { CONTACT_KINDS } from "#constants/contact";
import { SubscriptionStep } from "#features/client/subscriptions/services/steps/step.types";
import ValidateSubscriptionStepService from "#features/client/subscriptions/services/steps/validate.service";
import Company from "#models/company";
import Contact from "#models/contact";
import Subscription from "#models/subscription";
import { SignerSchema } from "#validators/subscription/representatives/contact.validator";

export type UpdateSignerPayload = Infer<typeof SignerSchema>;

function definedChanges(payload: UpdateSignerPayload) {
	return Object.fromEntries(
		Object.entries(payload).filter(([, value]) => value !== undefined),
	) as UpdateSignerPayload;
}

function hasValues(payload: UpdateSignerPayload) {
	return Object.values(payload).some((value) => value !== null && value !== undefined);
}

@inject()
export default class UpdateSignerService {
	constructor(protected validateSubscriptionStepService: ValidateSubscriptionStepService) {}

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
			await this.validateSubscriptionStepService.invalidate(
				subscription,
				trx,
				SubscriptionStep.COMPANY_REFERENCES,
			);

			return company;
		});
	}

	#applyRules(signer: Contact) {
		signer.kind = CONTACT_KINDS.PERSONNE_PHYSIQUE;
		signer.legalName = null;
		signer.isSameAsLegal = null;
		signer.amundiPortalId = null;
		signer.authorizations = null;
		signer.isSignatoryOnKbis ??= null;
	}
}
