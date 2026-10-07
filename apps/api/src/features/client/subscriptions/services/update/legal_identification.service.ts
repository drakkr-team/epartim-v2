import { inject } from "@adonisjs/core";
import db from "@adonisjs/lucid/services/db";
import type { Infer } from "@vinejs/vine/types";

import ChangeSubscriptionCompanyService from "#features/client/subscriptions/services/company_change.service";
import { SubscriptionStep } from "#features/client/subscriptions/services/steps/step.types";
import ValidateSubscriptionStepService from "#features/client/subscriptions/services/steps/validate.service";
import SubscriptionFormalismService from "#features/client/subscriptions/services/update/formalism/formalism.service";
import Company from "#models/company";
import Subscription from "#models/subscription";
import { UpdateLegalIdentificationSchema } from "#validators/subscription/legal_identification.validator";

export type UpdateLegalIdentificationPayload = Infer<typeof UpdateLegalIdentificationSchema>;

@inject()
export default class UpdateLegalIdentificationService {
	constructor(
		protected validateSubscriptionStepService: ValidateSubscriptionStepService,
		protected formalismService: SubscriptionFormalismService,
		protected companyChangeService: ChangeSubscriptionCompanyService,
	) {}

	async handle(subscription: Subscription, payload: UpdateLegalIdentificationPayload) {
		return db.transaction(async (trx) => {
			await this.formalismService.lock(subscription, trx);
			const company = await Company.findByOrFail("subscriptionId", subscription.id, {
				client: trx,
			});
			const { companyHeadcount, ...legalIdentification } = payload.legalIdentification;
			if (legalIdentification.siren !== undefined) {
				await this.companyChangeService.handle(
					subscription,
					company,
					legalIdentification.siren,
					payload.confirmCompanyChange ?? false,
					trx,
				);
			}
			const nextHeadcount =
				companyHeadcount === undefined
					? company.companyHeadcount
					: companyHeadcount === null
						? null
						: String(companyHeadcount);
			const headcountChanged = nextHeadcount !== company.companyHeadcount;

			await company
				.useTransaction(trx)
				.merge({
					...legalIdentification,
					...(companyHeadcount === undefined
						? {}
						: { companyHeadcount: companyHeadcount === null ? null : String(companyHeadcount) }),
				})
				.save();
			await this.validateSubscriptionStepService.invalidate(
				subscription,
				trx,
				SubscriptionStep.COMPANY_REFERENCES,
			);

			if (headcountChanged) await this.formalismService.synchronize(subscription, trx);
			return company;
		});
	}
}
