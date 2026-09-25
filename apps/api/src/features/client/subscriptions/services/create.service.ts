import db from "@adonisjs/lucid/services/db";

import Company from "#models/company";
import CompanyKycProfile from "#models/company_kyc_profile";
import Contact, { ContactKind } from "#models/contact";
import Subscription, { SubscriptionStatus } from "#models/subscription";
import SubscriptionPlan from "#models/subscription_plan";

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
			const company = await Company.create(
				{
					subscriptionId: subscription.id,
					companyLegalAgentId: legalAgent.id,
					companySignerId: signer.id,
				},
				{ client: trx },
			);
			await CompanyKycProfile.create({ companyId: company.id }, { client: trx });
			await SubscriptionPlan.create({ subscriptionId: subscription.id }, { client: trx });

			return subscription;
		});
	}
}
