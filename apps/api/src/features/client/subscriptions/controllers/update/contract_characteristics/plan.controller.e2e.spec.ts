import { test } from "@japa/runner";
import { DateTime } from "luxon";

import {
	SubscriptionMatchingCalculationMethod,
	SubscriptionMatchingDistributionPeriod,
} from "#constants/subscription_matching";
import { SubscriptionFactory } from "#database/factories/subscription.factory";
import { UserFactory } from "#database/factories/user.factory";
import Subscription from "#models/subscription";
import SubscriptionPlan from "#models/subscription_plan";

test.group(
	"Features / Client / Subscriptions / Controllers / Update Contract Characteristics Plan",
	() => {
		async function createSubscription() {
			const user = await UserFactory.create();
			const subscription = await SubscriptionFactory.merge({ createdBy: user.id }).create();

			return { subscription, user };
		}

		test("it saves plan values and applies their rules", async ({ client, assert }) => {
			const { subscription, user } = await createSubscription();

			const enabledResponse = await client
				.visit("client.subscriptions.update_contract_characteristics_plan", {
					subscriptionId: subscription.id,
				})
				.withGuard("client")
				.loginAs(user)
				.json({
					existingDeviceTransfer: true,
					estimatedTransferAmount: 123_456.78,
					minimumSeniorityMonths: 3,
					voluntaryPaymentsLimitedToPeriod: true,
					voluntaryPaymentPeriodStartDate: "2026-10-01",
					voluntaryPaymentPeriodEndDate: "2026-12-31",
				});

			enabledResponse.assertOk();
			const plan = await SubscriptionPlan.findByOrFail("subscriptionId", subscription.id);
			assert.equal(Number(plan.estimatedTransferAmountCents), 12_345_678);
			assert.equal(plan.minimumSeniorityMonths, 3);
			assert.equal(plan.voluntaryPaymentPeriodStartDate?.toISODate(), "2026-10-01");
			assert.equal(plan.voluntaryPaymentPeriodEndDate?.toISODate(), "2026-12-31");
			assert.equal(plan.matchingCalculationMethod, SubscriptionMatchingCalculationMethod.AMUNDI);
			assert.equal(plan.matchingDistributionPeriod, SubscriptionMatchingDistributionPeriod.YEARS);

			const disabledResponse = await client
				.visit("client.subscriptions.update_contract_characteristics_plan", {
					subscriptionId: subscription.id,
				})
				.withGuard("client")
				.loginAs(user)
				.json({
					existingDeviceTransfer: false,
					voluntaryPaymentsLimitedToPeriod: false,
				});

			disabledResponse.assertOk();
			const disabledPlan = await SubscriptionPlan.findOrFail(plan.id);
			assert.isNull(disabledPlan.estimatedTransferAmountCents);
			assert.isNull(disabledPlan.voluntaryPaymentPeriodStartDate);
			assert.isNull(disabledPlan.voluntaryPaymentPeriodEndDate);
		});

		test("it saves the matching preferences", async ({ client, assert }) => {
			const { subscription, user } = await createSubscription();

			const response = await client
				.visit("client.subscriptions.update_contract_characteristics_plan", {
					subscriptionId: subscription.id,
				})
				.withGuard("client")
				.loginAs(user)
				.json({
					matchingCalculationMethod: SubscriptionMatchingCalculationMethod.AMUNDI,
					matchingDistributionPeriod: SubscriptionMatchingDistributionPeriod.SEMESTER,
				});

			response.assertOk();
			const plan = await SubscriptionPlan.findByOrFail("subscriptionId", subscription.id);
			assert.equal(plan.matchingCalculationMethod, SubscriptionMatchingCalculationMethod.AMUNDI);
			assert.equal(
				plan.matchingDistributionPeriod,
				SubscriptionMatchingDistributionPeriod.SEMESTER,
			);
		});

		test("it validates plan values", async ({ client, assert }) => {
			const { subscription, user } = await createSubscription();
			const invalidPayloads = [
				{ estimatedTransferAmount: 0 },
				{ estimatedTransferAmount: 10.001 },
				{ voluntaryPaymentPeriodStartDate: "2026-02-30" },
				{ minimumSeniorityMonths: -1 },
				{ minimumSeniorityMonths: 4 },
				{ minimumSeniorityMonths: 1.5 },
				{ matchingCalculationMethod: "invalid" },
				{ matchingDistributionPeriod: "monthly" },
			];

			for (const payload of invalidPayloads) {
				const response = await client
					.visit("client.subscriptions.update_contract_characteristics_plan", {
						subscriptionId: subscription.id,
					})
					.withGuard("client")
					.loginAs(user)
					.unsafeJson(payload);
				response.assertStatus(422);
			}

			const plan = await SubscriptionPlan.create({
				subscriptionId: subscription.id,
				voluntaryPaymentsLimitedToPeriod: true,
				voluntaryPaymentPeriodStartDate: DateTime.fromISO("2026-10-01"),
				voluntaryPaymentPeriodEndDate: DateTime.fromISO("2026-12-31"),
			});
			const dateOrderResponse = await client
				.visit("client.subscriptions.update_contract_characteristics_plan", {
					subscriptionId: subscription.id,
				})
				.withGuard("client")
				.loginAs(user)
				.json({ voluntaryPaymentPeriodEndDate: "2026-09-30" });

			dateOrderResponse.assertStatus(422);
			assert.equal(
				(await SubscriptionPlan.findOrFail(plan.id)).voluntaryPaymentPeriodEndDate?.toISODate(),
				"2026-12-31",
			);
		});

		test("it invalidates contract characteristics and rejects another user", async ({
			client,
			assert,
		}) => {
			const { subscription, user } = await createSubscription();
			await subscription.merge({ completedSteps: [3] }).save();
			const response = await client
				.visit("client.subscriptions.update_contract_characteristics_plan", {
					subscriptionId: subscription.id,
				})
				.withGuard("client")
				.loginAs(user)
				.json({ minimumSeniorityMonths: 0 });

			response.assertOk();
			assert.deepEqual((await Subscription.findOrFail(subscription.id)).completedSteps, []);

			const otherUser = await UserFactory.create();
			const forbiddenResponse = await client
				.visit("client.subscriptions.update_contract_characteristics_plan", {
					subscriptionId: subscription.id,
				})
				.withGuard("client")
				.loginAs(otherUser)
				.json({ existingDeviceTransfer: true });

			forbiddenResponse.assertStatus(403);
		});
	},
);
