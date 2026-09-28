import { test } from "@japa/runner";

import {
	emptySubscriptionDeviceMatching,
	type SubscriptionDeviceMatching,
	SubscriptionMatchingDevice,
	SubscriptionMatchingLimitKind,
	SubscriptionMatchingPaymentType,
	SubscriptionMatchingRuleType,
} from "#constants/subscription_matching_rules";
import { SubscriptionPlanAdhesionType } from "#constants/subscription_plan_adhesion";
import { CompanyFactory } from "#database/factories/company.factory";
import { SubscriptionFactory } from "#database/factories/subscription.factory";
import { UserFactory } from "#database/factories/user.factory";
import Subscription from "#models/subscription";
import SubscriptionMatchingRule from "#models/subscription_matching_rule";
import SubscriptionPlan from "#models/subscription_plan";
import SubscriptionPlanAdhesion from "#models/subscription_plan_adhesion";

const completeUniform = {
	paymentType: SubscriptionMatchingPaymentType.VOLUNTARY,
	rate: 100,
	limitKind: SubscriptionMatchingLimitKind.LEGAL,
	limitAmount: 1200,
};

const completePeriod = {
	fromYears: 0,
	toYears: 2,
	rate: 50,
	limitKind: SubscriptionMatchingLimitKind.AMOUNT,
	limitAmount: 800,
};

function matching(changes: Partial<SubscriptionDeviceMatching>): SubscriptionDeviceMatching {
	return { ...emptySubscriptionDeviceMatching(), ...changes };
}

test.group("Features / Client / Subscriptions / Contract Matching", () => {
	async function createSubscription(
		device: SubscriptionMatchingDevice = SubscriptionMatchingDevice.PEI,
	) {
		const user = await UserFactory.create();
		const subscription = await SubscriptionFactory.merge({ createdBy: user.id }).create();
		await CompanyFactory.merge({ subscriptionId: subscription.id }).create();
		const plan = await SubscriptionPlan.create({
			subscriptionId: subscription.id,
			minimumSeniorityMonths: 0,
		});
		await SubscriptionPlanAdhesion.create({
			subscriptionPlanId: plan.id,
			type:
				device === SubscriptionMatchingDevice.PEI
					? SubscriptionPlanAdhesionType.PEI_EPARTIM
					: SubscriptionPlanAdhesionType.PER_COLI_EPARTIM,
		});
		return { user, subscription, plan };
	}

	test("it saves concurrent rule types in dedicated rows and reads them back", async ({
		client,
		assert,
	}) => {
		const { user, subscription, plan } = await createSubscription();
		await subscription.merge({ completedSteps: [3] }).save();
		const payload = matching({
			ruleTypes: [SubscriptionMatchingRuleType.UNIFORM, SubscriptionMatchingRuleType.SENIORITY],
			uniformRules: [completeUniform],
			seniorityRules: [
				{
					paymentType: SubscriptionMatchingPaymentType.PPV,
					periods: [completePeriod],
				},
			],
			specificRule: true,
			specificRuleDetails: "Une précision contractuelle.",
		});
		const response = await client
			.visit("client.subscriptions.update_contract_characteristics_matching", {
				subscriptionId: subscription.id,
			})
			.withGuard("client")
			.loginAs(user)
			.json({ device: SubscriptionMatchingDevice.PEI, matching: payload });

		response.assertOk();
		assert.deepEqual((await Subscription.findOrFail(subscription.id)).completedSteps, []);
		const rows = await SubscriptionMatchingRule.query()
			.where("subscriptionPlanId", plan.id)
			.orderBy("type");
		assert.deepEqual(
			rows.map((row) => row.type),
			["seniority", "specific", "uniform"],
		);
		assert.deepEqual(rows.find((row) => row.type === "uniform")?.details, {
			payments: [completeUniform],
		});

		const view = await client
			.visit("client.subscriptions.view", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user);
		view.assertOk();
		view.assertBodyContains({ contractCharacteristics: { matchingRules: { pei: payload } } });
	});

	test("it keeps an incomplete rule as a draft", async ({ client }) => {
		const { user, subscription } = await createSubscription();
		const response = await client
			.visit("client.subscriptions.update_contract_characteristics_matching", {
				subscriptionId: subscription.id,
			})
			.withGuard("client")
			.loginAs(user)
			.json({
				device: SubscriptionMatchingDevice.PEI,
				matching: matching({ ruleTypes: [SubscriptionMatchingRuleType.UNIFORM] }),
			});
		response.assertOk();
	});

	test("it saves five contiguous seniority periods with an open final threshold", async ({
		client,
	}) => {
		const { user, subscription } = await createSubscription();
		const periods = [
			{ ...completePeriod, fromYears: 0, toYears: 2 },
			{ ...completePeriod, fromYears: 2, toYears: 4 },
			{ ...completePeriod, fromYears: 4, toYears: 6 },
			{ ...completePeriod, fromYears: 6, toYears: 8 },
			{ ...completePeriod, fromYears: 8, toYears: null },
		];
		const response = await client
			.visit("client.subscriptions.update_contract_characteristics_matching", {
				subscriptionId: subscription.id,
			})
			.withGuard("client")
			.loginAs(user)
			.json({
				device: SubscriptionMatchingDevice.PEI,
				matching: matching({
					ruleTypes: [SubscriptionMatchingRuleType.SENIORITY],
					seniorityRules: [{ paymentType: SubscriptionMatchingPaymentType.VOLUNTARY, periods }],
				}),
			});
		response.assertOk();
	});

	test("it leaves matching validation to the form", async ({ client }) => {
		const { user, subscription } = await createSubscription(SubscriptionMatchingDevice.PER);
		const duplicate = await client
			.visit("client.subscriptions.update_contract_characteristics_matching", {
				subscriptionId: subscription.id,
			})
			.withGuard("client")
			.loginAs(user)
			.json({
				device: SubscriptionMatchingDevice.PER,
				matching: matching({
					ruleTypes: [SubscriptionMatchingRuleType.UNIFORM, SubscriptionMatchingRuleType.SENIORITY],
					uniformRules: [completeUniform],
					seniorityRules: [
						{ paymentType: SubscriptionMatchingPaymentType.VOLUNTARY, periods: [completePeriod] },
					],
				}),
			});
		duplicate.assertOk();
		const duplicateValidation = await client
			.visit("client.subscriptions.validate_step", { step: 3, subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user);
		duplicateValidation.assertOk();

		const unilateral = matching({
			ruleTypes: [SubscriptionMatchingRuleType.UNILATERAL],
			unilateralRule: { limitKind: SubscriptionMatchingLimitKind.LEGAL, limitAmount: 4000 },
		});
		const withoutAgreement = await client
			.visit("client.subscriptions.update_contract_characteristics_matching", {
				subscriptionId: subscription.id,
			})
			.withGuard("client")
			.loginAs(user)
			.json({ device: SubscriptionMatchingDevice.PER, matching: unilateral });
		withoutAgreement.assertOk();
		const ceilingValidation = await client
			.visit("client.subscriptions.validate_step", { step: 3, subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user);
		ceilingValidation.assertOk();
	});

	test("it removes deselected rule data and clears a deselected device", async ({
		client,
		assert,
	}) => {
		const { user, subscription, plan } = await createSubscription();
		await client
			.visit("client.subscriptions.update_contract_characteristics_matching", {
				subscriptionId: subscription.id,
			})
			.withGuard("client")
			.loginAs(user)
			.json({
				device: SubscriptionMatchingDevice.PEI,
				matching: matching({
					ruleTypes: [SubscriptionMatchingRuleType.UNIFORM],
					uniformRules: [completeUniform],
				}),
			});
		const cleared = await client
			.visit("client.subscriptions.update_contract_characteristics_matching", {
				subscriptionId: subscription.id,
			})
			.withGuard("client")
			.loginAs(user)
			.json({
				device: SubscriptionMatchingDevice.PEI,
				matching: emptySubscriptionDeviceMatching(),
			});
		cleared.assertOk();
		assert.lengthOf(await SubscriptionMatchingRule.query().where("subscriptionPlanId", plan.id), 0);

		await client
			.visit("client.subscriptions.update_contract_characteristics_matching", {
				subscriptionId: subscription.id,
			})
			.withGuard("client")
			.loginAs(user)
			.json({
				device: SubscriptionMatchingDevice.PEI,
				matching: matching({
					ruleTypes: [SubscriptionMatchingRuleType.UNIFORM],
					uniformRules: [completeUniform],
				}),
			});
		const deselected = await client
			.visit("client.subscriptions.update_contract_characteristics_adhesions", {
				subscriptionId: subscription.id,
			})
			.withGuard("client")
			.loginAs(user)
			.json({ adhesionTypes: [] });
		deselected.assertOk();
		assert.lengthOf(await SubscriptionMatchingRule.query().where("subscriptionPlanId", plan.id), 0);
	});

	test("it rejects a device without adhesion and another user's subscription", async ({
		client,
	}) => {
		const { user, subscription } = await createSubscription();
		const request = {
			device: SubscriptionMatchingDevice.PER,
			matching: emptySubscriptionDeviceMatching(),
		};
		const missingAdhesion = await client
			.visit("client.subscriptions.update_contract_characteristics_matching", {
				subscriptionId: subscription.id,
			})
			.withGuard("client")
			.loginAs(user)
			.json(request);
		missingAdhesion.assertStatus(422);

		const otherUser = await UserFactory.create();
		const forbidden = await client
			.visit("client.subscriptions.update_contract_characteristics_matching", {
				subscriptionId: subscription.id,
			})
			.withGuard("client")
			.loginAs(otherUser)
			.json(request);
		forbidden.assertStatus(403);
	});
});
