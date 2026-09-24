import { test } from "@japa/runner";

import { CONTACT_CIVILITIES } from "#constants/contact";
import { CompanyFactory } from "#database/factories/company.factory";
import { SubscriptionFactory } from "#database/factories/subscription.factory";
import { UserFactory } from "#database/factories/user.factory";
import Company from "#models/company";
import Contact from "#models/contact";

test.group("Features / Client / Subscriptions / Update Signer", () => {
	test("it persists the declared signer", async ({ client, assert }) => {
		const user = await UserFactory.create();
		const subscription = await SubscriptionFactory.merge({ createdBy: user.id }).create();
		await CompanyFactory.merge({ subscriptionId: subscription.id }).create();

		const response = await client
			.visit("client.subscriptions.update_signer", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user)
			.json({
				civility: CONTACT_CIVILITIES.MADAME,
				firstName: "Claire",
				lastName: "Martin",
				email: "claire.martin@example.test",
				phoneNumber: "+33612345678",
				isSignatoryOnKbis: true,
			});

		response.assertOk();

		const company = await Company.findByOrFail("subscriptionId", subscription.id);
		const signer = await Contact.findOrFail(company.companySignerId!);
		assert.equal(signer.firstName, "Claire");
		assert.isTrue(signer.isSignatoryOnKbis!);
	});

	test("it rejects an incomplete phone number", async ({ client }) => {
		const user = await UserFactory.create();
		const subscription = await SubscriptionFactory.merge({ createdBy: user.id }).create();
		await CompanyFactory.merge({ subscriptionId: subscription.id }).create();

		const response = await client
			.visit("client.subscriptions.update_signer", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user)
			.json({ phoneNumber: "+33783896" });

		response.assertStatus(422);
	});
});
