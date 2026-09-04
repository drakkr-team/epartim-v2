import { test } from "@japa/runner";

import { SubscriptionFactory } from "#database/factories/subscription.factory";
import { UserFactory } from "#database/factories/user.factory";
import Company from "#models/company";
import { SubscriptionStatus } from "#models/subscription";

test.group(
	"Features / Client / Subscriptions / Controllers / Update Legal Identification Controller",
	() => {
		test("it should persist a valid legal identification", async ({ client, assert }) => {
			const user = await UserFactory.create();
			const subscription = await SubscriptionFactory.merge({
				createdBy: user.id,
				status: SubscriptionStatus.DRAFT,
			}).create();

			const response = await client
				.visit("client.subscriptions.update_legal_identification", {
					subscriptionId: subscription.id,
				})
				.withGuard("client")
				.loginAs(user)
				.json({
					legalIdentification: {
						siren: "123456789",
						companyHeadcount: 12,
					},
				});

			response.assertOk();

			const company = await Company.findByOrFail("subscriptionId", subscription.id);
			assert.equal(company.siren, "123456789");
			assert.equal(company.companyHeadcount, "12");
		});

		test("it should reject invalid data before creating a company", async ({ client, assert }) => {
			const user = await UserFactory.create();
			const subscription = await SubscriptionFactory.merge({
				createdBy: user.id,
				status: SubscriptionStatus.DRAFT,
			}).create();

			const response = await client
				.visit("client.subscriptions.update_legal_identification", {
					subscriptionId: subscription.id,
				})
				.withGuard("client")
				.loginAs(user)
				.json({
					legalIdentification: { siren: "invalid" },
				});

			response.assertStatus(422);
			assert.isNull(await Company.findBy("subscriptionId", subscription.id));
		});

		test("it should not update another user's subscription", async ({ client }) => {
			const owner = await UserFactory.create();
			const otherUser = await UserFactory.create();
			const subscription = await SubscriptionFactory.merge({
				createdBy: owner.id,
				status: SubscriptionStatus.DRAFT,
			}).create();

			const response = await client
				.visit("client.subscriptions.update_legal_identification", {
					subscriptionId: subscription.id,
				})
				.withGuard("client")
				.loginAs(otherUser)
				.json({
					legalIdentification: { siren: "123456789" },
				});

			response.assertNotFound();
		});
	},
);
