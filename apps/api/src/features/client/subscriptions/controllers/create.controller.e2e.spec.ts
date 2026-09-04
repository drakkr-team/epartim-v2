import { test } from "@japa/runner";

import { UserFactory } from "#database/factories/user.factory";
import Subscription, { SubscriptionStatus } from "#models/subscription";

test.group("Features / Client / Subscriptions / Controllers / Create Controller", () => {
	test("it should create a draft subscription for the authenticated user", async ({
		client,
		assert,
	}) => {
		const user = await UserFactory.create();

		const response = await client
			.visit("client.subscriptions.create")
			.withGuard("client")
			.loginAs(user);

		response.assertCreated();
		response.assertBodyContains({
			createdBy: user.id,
			status: SubscriptionStatus.DRAFT,
			completedSteps: [],
		});

		const subscription = await Subscription.findOrFail(response.body().id);
		assert.equal(subscription.createdBy, user.id);
		assert.equal(subscription.status, SubscriptionStatus.DRAFT);
	});

	test("it should reject an unauthenticated request", async ({ client }) => {
		const response = await client.visit("client.subscriptions.create");

		response.assertUnauthorized();
		response.assertBodyContains({ code: "E_UNAUTHENTICATED" });
	});
});
