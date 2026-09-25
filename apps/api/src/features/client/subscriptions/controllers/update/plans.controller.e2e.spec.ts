import { test } from "@japa/runner";

import { SubscriptionPlanAdhesionType } from "#constants/subscription_plan_adhesion";
import { SubscriptionFactory } from "#database/factories/subscription.factory";
import { UserFactory } from "#database/factories/user.factory";
import Subscription from "#models/subscription";
import SubscriptionPlan from "#models/subscription_plan";
import SubscriptionPlanAdhesion from "#models/subscription_plan_adhesion";

test.group("Features / Client / Subscriptions / Controllers / Update Plans", () => {
	async function createSubscription() {
		const user = await UserFactory.create();
		const subscription = await SubscriptionFactory.merge({ createdBy: user.id }).create();

		return { subscription, user };
	}

	test("it persists the transfer and replaces the selected adhesions", async ({
		client,
		assert,
	}) => {
		const { subscription, user } = await createSubscription();

		const enabledResponse = await client
			.visit("client.subscriptions.update_plans", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user)
			.json({
				contractCharacteristics: {
					existingDeviceTransfer: true,
					estimatedTransferAmount: 123_456.78,
					adhesionTypes: [
						SubscriptionPlanAdhesionType.PEI_EPARTIM,
						SubscriptionPlanAdhesionType.VOLUNTARY_PARTICIPATION_AGREEMENT,
					],
				},
			});

		enabledResponse.assertOk();
		enabledResponse.assertBodyContains({
			existingDeviceTransfer: true,
			estimatedTransferAmount: 123_456.78,
			adhesionTypes: [
				SubscriptionPlanAdhesionType.PEI_EPARTIM,
				SubscriptionPlanAdhesionType.VOLUNTARY_PARTICIPATION_AGREEMENT,
			],
		});
		const plan = await SubscriptionPlan.findByOrFail("subscriptionId", subscription.id);
		assert.equal(Number(plan.estimatedTransferAmountCents), 12_345_678);
		assert.deepEqual(
			(
				await SubscriptionPlanAdhesion.query().where("subscriptionPlanId", plan.id).orderBy("type")
			).map((adhesion) => adhesion.type),
			[
				SubscriptionPlanAdhesionType.PEI_EPARTIM,
				SubscriptionPlanAdhesionType.VOLUNTARY_PARTICIPATION_AGREEMENT,
			],
		);

		const disabledResponse = await client
			.visit("client.subscriptions.update_plans", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user)
			.json({
				contractCharacteristics: {
					existingDeviceTransfer: false,
					adhesionTypes: [SubscriptionPlanAdhesionType.PER_COLI_EPARTIM],
				},
			});

		disabledResponse.assertOk();
		assert.isNull((await SubscriptionPlan.findOrFail(plan.id)).estimatedTransferAmountCents);
		assert.deepEqual(
			(
				await SubscriptionPlanAdhesion.query().where("subscriptionPlanId", plan.id).orderBy("type")
			).map((adhesion) => adhesion.type),
			[SubscriptionPlanAdhesionType.PER_COLI_EPARTIM],
		);
	});

	test("it rejects invalid transfer amounts", async ({ client }) => {
		const { subscription, user } = await createSubscription();

		const zeroResponse = await client
			.visit("client.subscriptions.update_plans", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user)
			.json({ contractCharacteristics: { estimatedTransferAmount: 0 } });
		zeroResponse.assertStatus(422);

		const precisionResponse = await client
			.visit("client.subscriptions.update_plans", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user)
			.json({ contractCharacteristics: { estimatedTransferAmount: 10.001 } });
		precisionResponse.assertStatus(422);
	});

	test("it invalidates contract characteristics after an automatic save", async ({
		client,
		assert,
	}) => {
		const { subscription, user } = await createSubscription();
		await subscription.merge({ completedSteps: [3] }).save();

		const response = await client
			.visit("client.subscriptions.update_plans", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user)
			.json({
				contractCharacteristics: {
					adhesionTypes: [SubscriptionPlanAdhesionType.PEI_EPARTIM],
				},
			});

		response.assertOk();
		assert.deepEqual((await Subscription.findOrFail(subscription.id)).completedSteps, []);
	});

	test("it rejects changes to another user's subscription", async ({ client }) => {
		const { subscription } = await createSubscription();
		const otherUser = await UserFactory.create();

		const response = await client
			.visit("client.subscriptions.update_plans", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(otherUser)
			.json({ contractCharacteristics: { existingDeviceTransfer: true } });

		response.assertStatus(403);
	});
});
