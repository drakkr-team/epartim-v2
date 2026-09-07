import db from "@adonisjs/lucid/services/db";

import Company from "#models/company";
import Subscription, { SubscriptionStatus } from "#models/subscription";

export default class CreateSubscriptionService {
	async handle(userId: number) {
		return db.transaction(async (trx) => {
			const subscription = await Subscription.create(
				{
					createdBy: userId,
					status: SubscriptionStatus.DRAFT,
					completedSteps: [],
				},
				{ client: trx },
			);
			await Company.create({ subscriptionId: subscription.id }, { client: trx });

			return subscription;
		});
	}
}
