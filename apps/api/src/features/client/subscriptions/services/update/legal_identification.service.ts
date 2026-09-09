import db from "@adonisjs/lucid/services/db";
import type { Infer } from "@vinejs/vine/types";

import Company from "#models/company";
import Subscription from "#models/subscription";
import { UpdateLegalIdentificationSchema } from "#validators/subscription/legal_identification.validator";

export type UpdateLegalIdentificationPayload = Infer<typeof UpdateLegalIdentificationSchema>;

export default class UpdateLegalIdentificationService {
	async handle(subscription: Subscription, payload: UpdateLegalIdentificationPayload) {
		return db.transaction(async (trx) => {
			const company = await Company.findByOrFail("subscriptionId", subscription.id, {
				client: trx,
			});
			const { companyHeadcount, ...legalIdentification } = payload.legalIdentification;

			await company
				.useTransaction(trx)
				.merge({
					...legalIdentification,
					...(companyHeadcount === undefined
						? {}
						: { companyHeadcount: companyHeadcount === null ? null : String(companyHeadcount) }),
				})
				.save();

			return company;
		});
	}
}
