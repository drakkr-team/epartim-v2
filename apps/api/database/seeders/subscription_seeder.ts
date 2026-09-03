import { BaseSeeder } from "@adonisjs/lucid/seeders";

import { CompanyFactory } from "#database/factories/company.factory";
import { CompanyContactFactory } from "#database/factories/company_contact.factory";
import { ContactFactory } from "#database/factories/contact.factory";
import { SubscriptionFactory } from "#database/factories/subscription.factory";

export default class extends BaseSeeder {
	static environment = ["development"];

	async run() {
		const subscriptions = await SubscriptionFactory.with("creator").createMany(10);

		for (const subscription of subscriptions) {
			const company = await CompanyFactory.merge({ subscriptionId: subscription.id })
				.with("address")
				.with("paymentDetail")
				.create();
			const legalAgent = await ContactFactory.merge({
				companyId: company.id,
				kind: "legal_representative",
				isSignatoryOnKbis: true,
			}).create();

			company.merge({ companyLegalAgentId: legalAgent.id });
			await company.save();

			const contacts = await ContactFactory.merge({ companyId: company.id }).createMany(2);

			for (const contact of [legalAgent, ...contacts]) {
				await CompanyContactFactory.merge({
					companyId: company.id,
					contactId: contact.id,
				}).create();
			}
		}
	}
}
