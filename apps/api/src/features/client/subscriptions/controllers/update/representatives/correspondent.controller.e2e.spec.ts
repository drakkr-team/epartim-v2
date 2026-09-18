import { test } from "@japa/runner";

import { CompanyFactory } from "#database/factories/company.factory";
import { ContactFactory } from "#database/factories/contact.factory";
import { SubscriptionFactory } from "#database/factories/subscription.factory";
import { UserFactory } from "#database/factories/user.factory";
import Company from "#models/company";
import Contact, { ContactCivility } from "#models/contact";

test.group("Features / Client / Subscriptions / Update Correspondent", () => {
	test("it creates and clears a correspondent independently from the legal agent", async ({
		client,
		assert,
	}) => {
		const user = await UserFactory.create();
		const subscription = await SubscriptionFactory.merge({ createdBy: user.id }).create();
		const legalAgent = await ContactFactory.create();
		await CompanyFactory.merge({
			subscriptionId: subscription.id,
			companyLegalAgentId: legalAgent.id,
		}).create();

		const createResponse = await client
			.visit("client.subscriptions.update_correspondent", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user)
			.json({
				isSameAsLegal: false,
				civility: ContactCivility.MONSIEUR,
				firstName: "Hugo",
				lastName: "Dupont",
				email: "hugo@example.test",
				phoneNumber: "+33698765432",
			});

		createResponse.assertOk();

		const company = await Company.findByOrFail("subscriptionId", subscription.id);
		assert.isFalse((await Contact.findOrFail(company.companyLegalAgentId!)).isSameAsLegal!);
		assert.equal((await Contact.findOrFail(company.companyCorrespondentId!)).firstName, "Hugo");

		const clearResponse = await client
			.visit("client.subscriptions.update_correspondent", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user)
			.json({ isSameAsLegal: true });

		clearResponse.assertOk();

		const updatedCompany = await Company.findByOrFail("subscriptionId", subscription.id);
		assert.isNull(updatedCompany.companyCorrespondentId);
		assert.isTrue((await Contact.findOrFail(updatedCompany.companyLegalAgentId!)).isSameAsLegal!);
	});
});
