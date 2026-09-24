import { test } from "@japa/runner";

import { CONTACT_AUTHORIZATIONS, CONTACT_CIVILITIES, CONTACT_FUNCTIONS } from "#constants/contact";
import { CompanyFactory } from "#database/factories/company.factory";
import { SubscriptionFactory } from "#database/factories/subscription.factory";
import { UserFactory } from "#database/factories/user.factory";
import Company from "#models/company";

test.group("Features / Client / Subscriptions / Update Authorizations", () => {
	test("it replaces the company authorizations", async ({ client, assert }) => {
		const user = await UserFactory.create();
		const subscription = await SubscriptionFactory.merge({ createdBy: user.id }).create();
		await CompanyFactory.merge({ subscriptionId: subscription.id }).create();

		const response = await client
			.visit("client.subscriptions.update_authorizations", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user)
			.json({
				authorizations: [
					{
						civility: CONTACT_CIVILITIES.MADAME,
						firstName: "Nora",
						lastName: "Petit",
						email: "nora.petit@example.test",
						phoneNumber: "+33611111111",
						function: CONTACT_FUNCTIONS.DAF,
						authorizations: [CONTACT_AUTHORIZATIONS.COMPTABLE, CONTACT_AUTHORIZATIONS.ADMINISTRER],
					},
				],
			});

		response.assertOk();

		const company = await Company.findByOrFail("subscriptionId", subscription.id);
		const authorizations = await company.related("contacts").query();
		assert.lengthOf(authorizations, 1);
		assert.deepEqual(authorizations[0].authorizations, [
			CONTACT_AUTHORIZATIONS.COMPTABLE,
			CONTACT_AUTHORIZATIONS.ADMINISTRER,
		]);
	});

	test("it rejects duplicate authorization emails", async ({ client }) => {
		const user = await UserFactory.create();
		const subscription = await SubscriptionFactory.merge({ createdBy: user.id }).create();
		await CompanyFactory.merge({ subscriptionId: subscription.id }).create();

		const response = await client
			.visit("client.subscriptions.update_authorizations", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user)
			.json({
				authorizations: [
					{ email: "doublon@example.test", phoneNumber: "+33611111111" },
					{ email: "doublon@example.test", phoneNumber: "+33622222222" },
				],
			});

		response.assertStatus(422);
	});

	test("it persists incomplete authorizations", async ({ client, assert }) => {
		const user = await UserFactory.create();
		const subscription = await SubscriptionFactory.merge({ createdBy: user.id }).create();
		await CompanyFactory.merge({ subscriptionId: subscription.id }).create();

		const response = await client
			.visit("client.subscriptions.update_authorizations", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user)
			.json({
				authorizations: [
					{ email: null, phoneNumber: null },
					{ email: null, phoneNumber: null },
				],
			});

		response.assertOk();

		const company = await Company.findByOrFail("subscriptionId", subscription.id);
		const authorizations = await company.related("contacts").query();
		assert.lengthOf(authorizations, 2);
		assert.isTrue(authorizations.every((authorization) => authorization.phoneNumber === null));
	});
});
