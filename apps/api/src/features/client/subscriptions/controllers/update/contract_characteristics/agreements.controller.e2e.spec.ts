import { test } from "@japa/runner";

import { SubscriptionAgreement } from "#constants/subscription_agreement";
import { SubscriptionFactory } from "#database/factories/subscription.factory";
import { UserFactory } from "#database/factories/user.factory";
import SubscriptionExistingAgreement from "#models/subscription_existing_agreement";
import SubscriptionPlan from "#models/subscription_plan";

test.group(
	"Features / Client / Subscriptions / Controllers / Update Contract Characteristics Agreements",
	() => {
		async function createSubscription() {
			const user = await UserFactory.create();
			const subscription = await SubscriptionFactory.merge({ createdBy: user.id }).create();

			return { subscription, user };
		}

		test("it saves every combination of agreements including none", async ({ client, assert }) => {
			const { subscription, user } = await createSubscription();
			const choices = Object.values(SubscriptionAgreement);

			for (let combination = 0; combination < 2 ** choices.length; combination++) {
				const existingAgreements = choices.filter((_, index) => (combination & (1 << index)) !== 0);
				const response = await client
					.visit("client.subscriptions.update_contract_characteristics_agreements", {
						subscriptionId: subscription.id,
					})
					.withGuard("client")
					.loginAs(user)
					.json({ existingAgreements });

				response.assertOk();
				assert.sameMembers(
					(await subscription.related("existingAgreements").query()).map(
						(agreement) => agreement.type,
					),
					existingAgreements,
				);
			}
		});

		test("it preserves retained agreements and scopes replacements to the subscription", async ({
			client,
			assert,
		}) => {
			const { subscription, user } = await createSubscription();
			const { subscription: otherSubscription } = await createSubscription();
			const retained = await SubscriptionExistingAgreement.create({
				subscriptionId: subscription.id,
				type: SubscriptionAgreement.PARTICIPATION,
			});
			const removed = await SubscriptionExistingAgreement.create({
				subscriptionId: subscription.id,
				type: SubscriptionAgreement.PPV,
			});
			const otherAgreement = await SubscriptionExistingAgreement.create({
				subscriptionId: otherSubscription.id,
				type: SubscriptionAgreement.PPV,
			});

			const response = await client
				.visit("client.subscriptions.update_contract_characteristics_agreements", {
					subscriptionId: subscription.id,
				})
				.withGuard("client")
				.loginAs(user)
				.json({
					existingAgreements: [
						SubscriptionAgreement.PARTICIPATION,
						SubscriptionAgreement.INCENTIVES,
					],
				});

			response.assertOk();
			assert.isNotNull(await SubscriptionExistingAgreement.find(retained.id));
			assert.isNull(await SubscriptionExistingAgreement.find(removed.id));
			assert.isNotNull(await SubscriptionExistingAgreement.find(otherAgreement.id));
		});

		test("it validates agreements and clears the details when other is deselected", async ({
			client,
			assert,
		}) => {
			const { subscription, user } = await createSubscription();
			const invalidResponse = await client
				.visit("client.subscriptions.update_contract_characteristics_agreements", {
					subscriptionId: subscription.id,
				})
				.withGuard("client")
				.loginAs(user)
				.unsafeJson({ existingAgreements: ["invalid"] });
			invalidResponse.assertStatus(422);

			const details = "Compte épargne-temps. ".repeat(100);
			const saveResponse = await client
				.visit("client.subscriptions.update_contract_characteristics_agreements", {
					subscriptionId: subscription.id,
				})
				.withGuard("client")
				.loginAs(user)
				.json({
					existingAgreements: [SubscriptionAgreement.OTHER],
					otherAgreementDetails: details,
				});
			saveResponse.assertOk();
			const plan = await SubscriptionPlan.findByOrFail("subscriptionId", subscription.id);
			assert.equal(plan.otherAgreementDetails, details.trim());

			const clearResponse = await client
				.visit("client.subscriptions.update_contract_characteristics_agreements", {
					subscriptionId: subscription.id,
				})
				.withGuard("client")
				.loginAs(user)
				.json({ existingAgreements: [] });
			clearResponse.assertOk();
			assert.isNull((await SubscriptionPlan.findOrFail(plan.id)).otherAgreementDetails);
		});
	},
);
