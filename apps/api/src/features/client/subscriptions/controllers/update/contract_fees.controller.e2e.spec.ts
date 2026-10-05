import { test } from "@japa/runner";

import {
	SubscriptionEntryFeePayer,
	SubscriptionPricingOffer,
} from "#constants/subscription_contract_fee";
import { CompanyFactory } from "#database/factories/company.factory";
import { SubscriptionFactory } from "#database/factories/subscription.factory";
import { UserFactory } from "#database/factories/user.factory";
import Subscription, { SubscriptionStatus } from "#models/subscription";
import SubscriptionContractFee from "#models/subscription_contract_fee";

test.group("Features / Client / Subscriptions / Controllers / Update Contract Fees", () => {
	async function createSubscription(companyHeadcount = "10") {
		const user = await UserFactory.create();
		const subscription = await SubscriptionFactory.apply("draft")
			.merge({ createdBy: user.id })
			.create();
		const company = await CompanyFactory.merge({
			subscriptionId: subscription.id,
			companyHeadcount,
		}).create();
		return { subscription, company, user };
	}

	test("it preselects the offer at the eleven employee boundary without writing on read", async ({
		client,
		assert,
	}) => {
		for (const [headcount, offer, annualFee, perEmployee] of [
			["10", SubscriptionPricingOffer.UNDER_ELEVEN_EMPLOYEES, 200, 0],
			["11", SubscriptionPricingOffer.ELEVEN_OR_MORE_EMPLOYEES, 115, 15],
		] as const) {
			const { subscription, user } = await createSubscription(headcount);
			const response = await client
				.visit("client.subscriptions.view", { subscriptionId: subscription.id })
				.withGuard("client")
				.loginAs(user);
			response.assertOk();
			assert.deepEqual(response.body().contractFees, {
				pricingOffer: offer,
				annualAccountFee: annualFee,
				annualAccountFeePerEmployee: perEmployee,
				entryFeePayer: null,
				entryFeeRate: null,
			});
			assert.isNull(await SubscriptionContractFee.findBy("subscriptionId", subscription.id));
		}
	});

	test("it saves a zero rate for savers and preserves it when changing the payer", async ({
		client,
		assert,
	}) => {
		const { subscription, user } = await createSubscription();
		const initial = await client
			.visit("client.subscriptions.update_contract_fees", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user)
			.json({ entryFeePayer: SubscriptionEntryFeePayer.SAVERS, entryFeeRate: 0 });
		initial.assertOk();
		assert.equal(initial.body().entryFeeRate, 0);
		const switched = await client
			.visit("client.subscriptions.update_contract_fees", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user)
			.json({ entryFeePayer: SubscriptionEntryFeePayer.COMPANY });
		switched.assertOk();
		assert.equal(switched.body().entryFeeRate, 0);
		assert.equal(switched.body().entryFeePayer, SubscriptionEntryFeePayer.COMPANY);
		assert.equal(
			(await SubscriptionContractFee.findByOrFail("subscriptionId", subscription.id))
				.entryFeeRateBasisPoints,
			0,
		);
	});

	test("it preserves the offer and saved annual prices after the headcount changes", async ({
		client,
		assert,
	}) => {
		const { subscription, company, user } = await createSubscription();
		const initial = await client
			.visit("client.subscriptions.update_contract_fees", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user)
			.json({ entryFeeRate: 4.5 });
		initial.assertOk();
		await company.merge({ companyHeadcount: "25" }).save();
		const fees = await SubscriptionContractFee.findByOrFail("subscriptionId", subscription.id);
		// Existing contracts retain their recorded prices even when the current grid differs.
		await fees.merge({ annualAccountFeeCents: 19000n }).save();
		const updated = await client
			.visit("client.subscriptions.update_contract_fees", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user)
			.json({
				entryFeePayer: SubscriptionEntryFeePayer.SAVERS,
				pricingOffer: SubscriptionPricingOffer.UNDER_ELEVEN_EMPLOYEES,
			});
		updated.assertOk();
		const viewed = await client
			.visit("client.subscriptions.view", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user);
		viewed.assertOk();
		assert.deepEqual(viewed.body().contractFees, {
			pricingOffer: SubscriptionPricingOffer.UNDER_ELEVEN_EMPLOYEES,
			annualAccountFee: 190,
			annualAccountFeePerEmployee: 0,
			entryFeePayer: SubscriptionEntryFeePayer.SAVERS,
			entryFeeRate: 4.5,
		});
	});

	test("it changes the standard offer explicitly and preserves the two-decimal entry rate", async ({
		client,
		assert,
	}) => {
		const { subscription, user } = await createSubscription();
		const initial = await client
			.visit("client.subscriptions.update_contract_fees", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user)
			.json({ entryFeeRate: 2.35, entryFeePayer: SubscriptionEntryFeePayer.COMPANY });
		initial.assertOk();
		const switched = await client
			.visit("client.subscriptions.update_contract_fees", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user)
			.json({ pricingOffer: SubscriptionPricingOffer.ELEVEN_OR_MORE_EMPLOYEES });
		switched.assertOk();
		assert.deepEqual(switched.body(), {
			pricingOffer: SubscriptionPricingOffer.ELEVEN_OR_MORE_EMPLOYEES,
			annualAccountFee: 115,
			annualAccountFeePerEmployee: 15,
			entryFeePayer: SubscriptionEntryFeePayer.COMPANY,
			entryFeeRate: 2.35,
		});
		assert.equal(
			(await SubscriptionContractFee.findByOrFail("subscriptionId", subscription.id))
				.entryFeeRateBasisPoints,
			235,
		);
	});

	test("it accepts partial drafts without clearing omitted fields", async ({ client, assert }) => {
		const { subscription, user } = await createSubscription("11");
		const response = await client
			.visit("client.subscriptions.update_contract_fees", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user)
			.json({ entryFeePayer: null, entryFeeRate: null });
		response.assertOk();
		assert.equal(response.body().pricingOffer, SubscriptionPricingOffer.ELEVEN_OR_MORE_EMPLOYEES);
		assert.isNull(response.body().entryFeeRate);
		assert.isNull(response.body().entryFeePayer);
	});

	test("it rejects invalid rates, payers and non-standard offers without persisting them", async ({
		client,
		assert,
	}) => {
		const { subscription, user } = await createSubscription();
		for (const payload of [
			{ entryFeeRate: -0.01 },
			{ entryFeeRate: 4.51 },
			{ entryFeeRate: 2.351 },
			{ entryFeeRate: "invalid" },
			{ entryFeePayer: 3 },
			{ pricingOffer: 3 },
		]) {
			const response = await client
				.visit("client.subscriptions.update_contract_fees", { subscriptionId: subscription.id })
				.withGuard("client")
				.loginAs(user)
				.unsafeJson(payload);
			response.assertStatus(422);
		}
		assert.isNull(await SubscriptionContractFee.findBy("subscriptionId", subscription.id));
	});

	test("it uses the existing step validation and invalidates only step four on save", async ({
		client,
		assert,
	}) => {
		const { subscription, user } = await createSubscription();
		await subscription.merge({ completedSteps: [1, 2, 3] }).save();
		const validation = await client
			.visit("client.subscriptions.validate_step", { subscriptionId: subscription.id, step: "4" })
			.withGuard("client")
			.loginAs(user);
		validation.assertOk();
		const validated = await Subscription.findOrFail(subscription.id);
		assert.deepEqual(validated.completedSteps, [1, 2, 3, 4]);
		assert.equal(validated.status, SubscriptionStatus.DRAFT);
		const updated = await client
			.visit("client.subscriptions.update_contract_fees", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(user)
			.json({ entryFeeRate: 1.25 });
		updated.assertOk();
		assert.deepEqual((await Subscription.findOrFail(subscription.id)).completedSteps, [1, 2, 3]);
	});

	test("it requires the creator client session and rejects missing subscriptions", async ({
		client,
		assert,
	}) => {
		const { subscription, user } = await createSubscription();
		const otherUser = await UserFactory.create();
		const unauthenticated = await client
			.visit("client.subscriptions.update_contract_fees", { subscriptionId: subscription.id })
			.json({ entryFeeRate: 1 });
		unauthenticated.assertStatus(401);
		const forbidden = await client
			.visit("client.subscriptions.update_contract_fees", { subscriptionId: subscription.id })
			.withGuard("client")
			.loginAs(otherUser)
			.json({ entryFeeRate: 1 });
		forbidden.assertStatus(403);
		assert.isNull(await SubscriptionContractFee.findBy("subscriptionId", subscription.id));
		const missing = await client
			.visit("client.subscriptions.update_contract_fees", { subscriptionId: 2147483647 })
			.withGuard("client")
			.loginAs(user)
			.json({ entryFeeRate: 1 });
		missing.assertStatus(404);
	});
});
