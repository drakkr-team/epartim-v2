import db from "@adonisjs/lucid/services/db";
import type { Infer } from "@vinejs/vine/types";

import Company from "#models/company";
import Subscription from "#models/subscription";
import { UpdateSubscriptionLegalIdentificationSchema } from "#validators/subscription_legal_identification.validator";

export type UpdateLegalIdentificationPayload = Infer<
	typeof UpdateSubscriptionLegalIdentificationSchema
>;

export default class UpdateLegalIdentificationService {
	async handle(subscription: Subscription, payload: UpdateLegalIdentificationPayload) {
		return db.transaction(async (trx) => {
			const company = await Company.query({ client: trx })
				.where("subscriptionId", subscription.id)
				.firstOrFail();
			const { companyHeadcount, ...legalIdentification } = payload.legalIdentification;

			await company
				.useTransaction(trx)
				.merge({
					...legalIdentification,
					...(companyHeadcount === undefined ? {} : { companyHeadcount: String(companyHeadcount) }),
				})
				.save();

			return company;
		});
	}
}
