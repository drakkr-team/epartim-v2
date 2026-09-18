import { BaseSeeder } from "@adonisjs/lucid/seeders";

import { CompanyFactory } from "#database/factories/company.factory";
import { ContactFactory } from "#database/factories/contact.factory";
import { SubscriptionFactory } from "#database/factories/subscription.factory";

export default class extends BaseSeeder {
	static environment = ["development"];

	async run() {
		const subscriptions = await SubscriptionFactory.with("creator").createMany(10);

		for (const [index, subscription] of subscriptions.entries()) {
			const company = await CompanyFactory.merge({ subscriptionId: subscription.id })
				.with("address")
				.with("paymentDetail")
				.create();
			const legalAgentFactory =
				index % 3 === 2 ? ContactFactory.apply("legalEntity") : ContactFactory;
			const hasDistinctCorrespondent = index % 3 !== 0;
			const legalAgent = await legalAgentFactory
				.merge({
					isSameAsLegal: !hasDistinctCorrespondent,
				})
				.create();
			const correspondent = hasDistinctCorrespondent ? await ContactFactory.create() : null;
			const signer = await ContactFactory.merge({ isSignatoryOnKbis: true }).create();
			const authorizedContacts = await ContactFactory.apply("withAuthorizations").createMany(2);

			company.merge({
				companyLegalAgentId: legalAgent.id,
				companyCorrespondentId: correspondent?.id ?? null,
				companySignerId: signer.id,
			});
			await company.save();

			await company.related("contacts").attach(authorizedContacts.map((contact) => contact.id));
		}
	}
}
