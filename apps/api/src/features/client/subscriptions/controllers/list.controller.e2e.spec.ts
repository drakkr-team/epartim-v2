import { test } from "@japa/runner";
import { DateTime } from "luxon";

import { CompanyFactory } from "#database/factories/company.factory";
import { SubscriptionFactory } from "#database/factories/subscription.factory";
import { UserFactory } from "#database/factories/user.factory";
import Subscription from "#models/subscription";

test.group("Features / Client / Subscriptions / Controllers / List Controller", () => {
	test("it returns paginated subscriptions with their companies", async ({ client, assert }) => {
		const user = await UserFactory.create();
		const otherUser = await UserFactory.create();
		const initialResponse = await client
			.visit("client.subscriptions.list")
			.withGuard("client")
			.loginAs(user);
		initialResponse.assertOk();
		const initialTotal = initialResponse.body().meta.total;

		const firstSubscription = await SubscriptionFactory.merge({ createdBy: otherUser.id }).create();
		const firstCompany = await CompanyFactory.merge({
			name: "First listed company",
			subscriptionId: firstSubscription.id,
		}).create();
		const secondSubscription = await SubscriptionFactory.create();
		await CompanyFactory.merge({
			name: "Second listed company",
			subscriptionId: secondSubscription.id,
		}).create();
		await Subscription.query()
			.where("id", firstSubscription.id)
			.update({
				createdAt: DateTime.fromISO("2100-01-01T00:00:00.000Z"),
			});
		await Subscription.query()
			.where("id", secondSubscription.id)
			.update({
				createdAt: DateTime.fromISO("2100-02-01T00:00:00.000Z"),
			});

		const response = await client
			.visit("client.subscriptions.list")
			.withGuard("client")
			.loginAs(user)
			.qs({ page: 2, perPage: 1 });

		response.assertOk();
		response.assertBodyContains({
			meta: {
				currentPage: 2,
				perPage: 1,
				total: initialTotal + 2,
			},
			data: [
				{
					id: firstSubscription.id,
					company: {
						name: firstCompany.name,
					},
				},
			],
		});
		assert.lengthOf(response.body().data, 1);
		assert.deepEqual(Object.keys(response.body().data[0].company), ["name"]);
	});

	test("it rejects unauthenticated requests", async ({ client }) => {
		const response = await client.visit("client.subscriptions.list");

		response.assertUnauthorized();
		response.assertBodyContains({ code: "E_UNAUTHENTICATED" });
	});
});
