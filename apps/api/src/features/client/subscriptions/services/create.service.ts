import db from "@adonisjs/lucid/services/db";

import Company from "#models/company";
import Contact, { ContactKind } from "#models/contact";
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
			const legalAgent = await Contact.create(
				{ kind: ContactKind.PERSONNE_PHYSIQUE },
				{ client: trx },
			);
			const signer = await Contact.create(
				{ kind: ContactKind.PERSONNE_PHYSIQUE, isSignatoryOnKbis: true },
				{ client: trx },
			);
			await Company.create(
				{
					subscriptionId: subscription.id,
					companyLegalAgentId: legalAgent.id,
					companySignerId: signer.id,
				},
				{ client: trx },
			);

			return subscription;
		});
	}
}
