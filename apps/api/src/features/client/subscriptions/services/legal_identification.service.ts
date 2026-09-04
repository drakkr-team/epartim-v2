import db from "@adonisjs/lucid/services/db";
import type { TransactionClientContract } from "@adonisjs/lucid/types/database";
import type { Infer } from "@vinejs/vine/types";

import Company from "#models/company";
import Subscription, { SubscriptionStatus } from "#models/subscription";
import { UpdateSubscriptionLegalIdentificationSchema } from "#validators/subscription_legal_identification.validator";

export type UpdateSubscriptionLegalIdentificationPayload = Infer<
	typeof UpdateSubscriptionLegalIdentificationSchema
>;

export default class SubscriptionLegalIdentificationService {
	async createDraft(userId: number) {
		return Subscription.create({
			createdBy: userId,
			status: SubscriptionStatus.DRAFT,
			completedSteps: [],
		});
	}

	async findForUserOrFail(subscriptionId: number | string, userId: number) {
		return Subscription.query()
			.where("id", subscriptionId)
			.where("createdBy", userId)
			.firstOrFail();
	}

	async getLegalIdentification(subscriptionId: number | string, userId: number) {
		const subscription = await this.findForUserOrFail(subscriptionId, userId);
		await subscription.load("company");

		return subscription;
	}

	async updateLegalIdentification(
		subscriptionId: number | string,
		userId: number,
		payload: UpdateSubscriptionLegalIdentificationPayload,
	) {
		const subscription = await this.findForUserOrFail(subscriptionId, userId);

		return db.transaction(async (trx) => {
			const company = await this.ensureCompany(subscription, trx);
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

	private async ensureCompany(subscription: Subscription, trx: TransactionClientContract) {
		const existingCompany = await Company.query({ client: trx })
			.where("subscriptionId", subscription.id)
			.first();
		if (existingCompany) return existingCompany;

		return Company.create({ subscriptionId: subscription.id }, { client: trx });
	}
}
