import { test } from "@japa/runner";

import { CompanyFactory } from "#database/factories/company.factory";
import { SubscriptionFactory } from "#database/factories/subscription.factory";
import { UserFactory } from "#database/factories/user.factory";

test.group("Features / Client / Subscriptions / Controllers / View Controller", () => {
	test("it should return the legal identification of its own subscription", async ({ client }) => {
		const user = await UserFactory.create();
		const subscription = await SubscriptionFactory.merge({ createdBy: user.id }).create();
		const company = await CompanyFactory.merge({ subscriptionId: subscription.id }).create();

		const response = await client
			.visit("client.subscriptions.view", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user);

		response.assertOk();
		response.assertBodyContains({
			id: subscription.id,
			legalIdentification: {
				siren: company.siren,
				name: company.name,
			},
		});
	});
});
