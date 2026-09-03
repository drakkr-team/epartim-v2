import { BaseSeeder } from "@adonisjs/lucid/seeders";

import { CompanyFactory } from "#database/factories/company.factory";
import { ContactFactory } from "#database/factories/contact.factory";
import { SubscriptionFactory } from "#database/factories/subscription.factory";
import { ContactKind } from "#models/contact";

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
			const legalAgent = await legalAgentFactory
				.merge({
					isSignatoryOnKbis: true,
				})
				.create();
			const hasDistinctCorrespondent =
				legalAgent.kind === ContactKind.PERSONNE_MORALE || index % 3 === 1;
			const correspondent = hasDistinctCorrespondent ? await ContactFactory.create() : null;
			const authorizedContacts = await ContactFactory.apply("withAuthorizations").createMany(2);

			company.merge({
				companyLegalAgentId: legalAgent.id,
				companyCorrespondentId: correspondent?.id ?? null,
			});
			await company.save();

			await company
				.related("contacts")
				.attach(
					[legalAgent, correspondent, ...authorizedContacts].flatMap(
						(contact) => contact?.id ?? [],
					),
				);
		}
	}
}
