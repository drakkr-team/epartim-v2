import { test } from "@japa/runner";
import { DateTime } from "luxon";

import { CompanyFactory } from "#database/factories/company.factory";
import { SubscriptionFactory } from "#database/factories/subscription.factory";
import { UserFactory } from "#database/factories/user.factory";
import Subscription, { SubscriptionStatus } from "#models/subscription";
import SubscriptionPlan from "#models/subscription_plan";
import SubscriptionPlanAdhesion from "#models/subscription_plan_adhesion";

test.group("Features / Client / Subscriptions / Voluntary participation", () => {
	async function setup(headcount: string | null = "50", selected = true) {
		const user = await UserFactory.create();
		const subscription = await SubscriptionFactory.merge({
			createdBy: user.id,
			status: SubscriptionStatus.DRAFT,
		}).create();
		await CompanyFactory.merge({
			subscriptionId: subscription.id,
			companyHeadcount: headcount,
		}).create();
		const plan = await SubscriptionPlan.create({ subscriptionId: subscription.id });
		await SubscriptionPlanAdhesion.createMany(
			(selected ? ([1, 3] as const) : ([1] as const)).map((type) => ({
				subscriptionPlanId: plan.id,
				type,
			})),
		);
		return { user, subscription, plan };
	}
	const answers = {
		voluntaryParticipationDuration: 0,
		voluntaryParticipationStartDate: "2026-01-01",
		voluntaryParticipationEndDate: "2026-12-31",
		voluntaryParticipationMinimumSeniorityMonths: 0,
		voluntaryParticipationSalaryPercentage: 33.33,
		voluntaryParticipationPresencePercentage: 0,
		voluntaryParticipationEqualPercentage: 100,
		voluntaryParticipationFormula: 5,
	};

	test("it saves independent partial answers and exposes them after reload without a sum constraint", async ({
		client,
		assert,
	}) => {
		const { user, subscription, plan } = await setup();
		for (const [field, value] of Object.entries(answers)) {
			const response = await client
				.visit("client.subscriptions.update_contract_characteristics_plan", {
					subscriptionId: subscription.id,
				})
				.withGuard("client")
				.loginAs(user)
				.unsafeJson({ [field]: value });
			response.assertOk();
		}
		await plan.refresh();
		assert.equal(plan.voluntaryParticipationSalaryBasisPoints, 3333);
		assert.equal(plan.voluntaryParticipationPresenceBasisPoints, 0);
		assert.equal(plan.voluntaryParticipationEqualBasisPoints, 10000);
		assert.isNull(plan.minimumSeniorityMonths);
		const view = await client
			.visit("client.subscriptions.view", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user);
		view.assertOk();
		view.assertBodyContains({ contractCharacteristics: answers });
	});

	test("it rejects invalid answers and preserves the saved dates", async ({ client, assert }) => {
		const { user, subscription, plan } = await setup();
		await plan
			.merge({
				voluntaryParticipationStartDate: DateTime.fromISO("2026-01-01"),
				voluntaryParticipationEndDate: DateTime.fromISO("2026-12-31"),
			})
			.save();
		const invalid = [
			{ voluntaryParticipationDuration: 4 },
			{ voluntaryParticipationMinimumSeniorityMonths: 4 },
			{ voluntaryParticipationMinimumSeniorityMonths: 1.5 },
			{ voluntaryParticipationFormula: 6 },
			{ voluntaryParticipationSalaryPercentage: -1 },
			{ voluntaryParticipationPresencePercentage: 101 },
			{ voluntaryParticipationEqualPercentage: 33.333 },
			{ voluntaryParticipationStartDate: "2026-02-30" },
			{ voluntaryParticipationEndDate: "2026-01-01" },
			{ voluntaryParticipationEndDate: "2025-12-31" },
			{ voluntaryParticipationStartDate: "2027-01-01" },
		];
		for (const payload of invalid) {
			const response = await client
				.visit("client.subscriptions.update_contract_characteristics_plan", {
					subscriptionId: subscription.id,
				})
				.withGuard("client")
				.loginAs(user)
				.unsafeJson(payload);
			response.assertStatus(422);
		}
		await plan.refresh();
		assert.equal(plan.voluntaryParticipationStartDate?.toISODate(), "2026-01-01");
		assert.equal(plan.voluntaryParticipationEndDate?.toISODate(), "2026-12-31");
	});

	test("it accepts every duration, seniority and contractual formula", async ({ client }) => {
		const { user, subscription } = await setup();
		for (const value of [0, 1, 2, 3] as const) {
			const response = await client
				.visit("client.subscriptions.update_contract_characteristics_plan", {
					subscriptionId: subscription.id,
				})
				.withGuard("client")
				.loginAs(user)
				.json({
					voluntaryParticipationDuration: value,
					voluntaryParticipationMinimumSeniorityMonths: value,
				});
			response.assertOk();
		}
		for (const value of [1, 2, 3, 4, 5]) {
			const response = await client
				.visit("client.subscriptions.update_contract_characteristics_plan", {
					subscriptionId: subscription.id,
				})
				.withGuard("client")
				.loginAs(user)
				.unsafeJson({ voluntaryParticipationFormula: value });
			response.assertOk();
		}
	});

	test("it clears draft dates and invalidates step 3", async ({ client, assert }) => {
		const { user, subscription, plan } = await setup();
		await subscription.merge({ completedSteps: [3] }).save();
		await plan.merge({ voluntaryParticipationStartDate: DateTime.fromISO("2026-01-01") }).save();
		const response = await client
			.visit("client.subscriptions.update_contract_characteristics_plan", {
				subscriptionId: subscription.id,
			})
			.withGuard("client")
			.loginAs(user)
			.json({ voluntaryParticipationStartDate: null });
		response.assertOk();
		await plan.refresh();
		assert.isNull(plan.voluntaryParticipationStartDate);
		assert.deepEqual((await Subscription.findOrFail(subscription.id)).completedSteps, []);
	});

	test("it requires a selected agreement without rechecking its headcount", async ({ client }) => {
		const unselected = await setup("50", false);
		const rejected = await client
			.visit("client.subscriptions.update_contract_characteristics_plan", {
				subscriptionId: unselected.subscription.id,
			})
			.withGuard("client")
			.loginAs(unselected.user)
			.json({ voluntaryParticipationDuration: 1 });
		rejected.assertStatus(422);
		const registered = await setup("51");
		const saved = await client
			.visit("client.subscriptions.update_contract_characteristics_plan", {
				subscriptionId: registered.subscription.id,
			})
			.withGuard("client")
			.loginAs(registered.user)
			.json({ voluntaryParticipationDuration: 1 });
		saved.assertOk();
	});

	test("it enforces headcount eligibility when activating the option", async ({ client }) => {
		for (const headcount of ["1", "49", "50", "51", null]) {
			const { user, subscription } = await setup(headcount, false);
			const response = await client
				.visit("client.subscriptions.update_contract_characteristics_adhesions", {
					subscriptionId: subscription.id,
				})
				.withGuard("client")
				.loginAs(user)
				.json({ adhesionTypes: [1, 3] });
			response.assertStatus(headcount !== null && Number(headcount) <= 50 ? 200 : 422);
		}
	});

	test("a headcount change preserves step 3 when no participation agreement is selected", async ({
		client,
		assert,
	}) => {
		const { user, subscription } = await setup("50", false);
		await subscription.merge({ completedSteps: [3] }).save();
		const response = await client
			.visit("client.subscriptions.update_legal_identification", {
				subscriptionId: subscription.id,
			})
			.withGuard("client")
			.loginAs(user)
			.json({ legalIdentification: { companyHeadcount: 51 } });
		response.assertOk();
		assert.deepEqual((await Subscription.findOrFail(subscription.id)).completedSteps, [3]);
	});

	for (const types of [[1], []]) {
		test(`it erases all answers when deselected with adhesions ${JSON.stringify(types)}`, async ({
			client,
			assert,
		}) => {
			const { user, subscription, plan } = await setup();
			const filled = await client
				.visit("client.subscriptions.update_contract_characteristics_plan", {
					subscriptionId: subscription.id,
				})
				.withGuard("client")
				.loginAs(user)
				.unsafeJson(answers);
			filled.assertOk();
			const response = await client
				.visit("client.subscriptions.update_contract_characteristics_adhesions", {
					subscriptionId: subscription.id,
				})
				.withGuard("client")
				.loginAs(user)
				.unsafeJson({ adhesionTypes: types });
			response.assertOk();
			const view = await client
				.visit("client.subscriptions.view", { subscriptionId: subscription.id })
				.withGuard("client")
				.loginAs(user);
			view.assertBodyContains({
				contractCharacteristics: Object.fromEntries(Object.keys(answers).map((key) => [key, null])),
			});
			assert.deepEqual(
				(
					await SubscriptionPlanAdhesion.query()
						.where("subscriptionPlanId", plan.id)
						.orderBy("type")
				).map((adhesion) => adhesion.type),
				types,
			);
		});
	}

	for (const headcount of [49, 50, 51, null]) {
		test(`it synchronizes agreement answers when headcount becomes ${headcount}`, async ({
			client,
			assert,
		}) => {
			const { user, subscription, plan } = await setup("48");
			const filled = await client
				.visit("client.subscriptions.update_contract_characteristics_plan", {
					subscriptionId: subscription.id,
				})
				.withGuard("client")
				.loginAs(user)
				.unsafeJson(answers);
			filled.assertOk();
			await subscription.merge({ completedSteps: [1, 3, 5] }).save();
			const response = await client
				.visit("client.subscriptions.update_legal_identification", {
					subscriptionId: subscription.id,
				})
				.withGuard("client")
				.loginAs(user)
				.json({ legalIdentification: { companyHeadcount: headcount } });
			response.assertOk();
			const eligible = headcount !== null && headcount <= 50;
			assert.deepEqual(
				(
					await SubscriptionPlanAdhesion.query()
						.where("subscriptionPlanId", plan.id)
						.orderBy("type")
				).map((adhesion) => adhesion.type),
				eligible ? [1, 3] : [1],
			);
			const view = await client
				.visit("client.subscriptions.view", { subscriptionId: subscription.id })
				.withGuard("client")
				.loginAs(user);
			view.assertBodyContains({
				contractCharacteristics: eligible
					? answers
					: Object.fromEntries(Object.keys(answers).map((key) => [key, null])),
			});
			assert.deepEqual(
				(await Subscription.findOrFail(subscription.id)).completedSteps,
				eligible ? [3] : [],
			);
			if (!eligible) {
				const rejected = await client
					.visit("client.subscriptions.update_contract_characteristics_plan", {
						subscriptionId: subscription.id,
					})
					.withGuard("client")
					.loginAs(user)
					.json({ voluntaryParticipationDuration: 1 });
				rejected.assertStatus(422);
			}
		});
	}
});
