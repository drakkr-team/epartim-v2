import { test } from "@japa/runner";
import { DateTime } from "luxon";

import { CompanyFactory } from "#database/factories/company.factory";
import { SubscriptionFactory } from "#database/factories/subscription.factory";
import { UserFactory } from "#database/factories/user.factory";
import Subscription, { SubscriptionStatus } from "#models/subscription";

test.group("Features / Client / Subscriptions / Controllers / List Controller", () => {
	test("it filters subscriptions and returns counts for each list status", async ({
		client,
		assert,
	}) => {
		const search = "subscription-status-counts";
		const draftSubscription = await SubscriptionFactory.merge({
			status: SubscriptionStatus.DRAFT,
		}).create();
		const waitingForSignaturesSubscription = await SubscriptionFactory.merge({
			status: SubscriptionStatus.WAITING_FOR_SIGNATURES,
		}).create();
		const toBeSentSubscription = await SubscriptionFactory.merge({
			status: SubscriptionStatus.TO_BE_SENT,
		}).create();
		const completeSubscription = await SubscriptionFactory.merge({
			status: SubscriptionStatus.COMPLETE,
		}).create();
		const errorSubscription = await SubscriptionFactory.merge({
			status: SubscriptionStatus.ERROR,
		}).create();

		for (const subscription of [
			draftSubscription,
			waitingForSignaturesSubscription,
			toBeSentSubscription,
			completeSubscription,
			errorSubscription,
		]) {
			await CompanyFactory.merge({
				name: `${search} ${subscription.id}`,
				subscriptionId: subscription.id,
			}).create();
		}

		const response = await client
			.visit("client.subscriptions.list")
			.withGuard("client")
			.loginAs(await UserFactory.create())
			.qs({ q: search, status: "validating" });

		response.assertOk();
		assert.sameMembers(
			response.body().data.map((subscription) => subscription.id),
			[waitingForSignaturesSubscription.id, toBeSentSubscription.id],
		);
		assert.deepEqual(response.body().meta.statusCounts, {
			draft: 1,
			validating: 2,
			finalized: 2,
		});
	});

	test("it searches subscriptions by their BSE reference", async ({ client, assert }) => {
		const subscription = await SubscriptionFactory.merge({
			id: 10_000,
			status: SubscriptionStatus.DRAFT,
		}).create();
		await CompanyFactory.merge({ subscriptionId: subscription.id }).create();
		await Subscription.query()
			.where("id", subscription.id)
			.update({
				createdAt: DateTime.fromISO("2026-09-04T00:00:00.000Z"),
			});
		const reference = `BSE-2026-${subscription.id.toString().padStart(4, "0")}`;

		const response = await client
			.visit("client.subscriptions.list")
			.withGuard("client")
			.loginAs(await UserFactory.create())
			.qs({ q: reference });

		response.assertOk();
		assert.lengthOf(response.body().data, 1);
		response.assertBodyContains({ data: [{ id: subscription.id }] });
	});

	test("it filters subscriptions by progress and creation date", async ({ client, assert }) => {
		const matchingDraftSubscription = await SubscriptionFactory.merge({
			completedSteps: ["company", "contacts"],
			status: SubscriptionStatus.DRAFT,
		}).create();
		const matchingFinalizedSubscription = await SubscriptionFactory.merge({
			completedSteps: ["company", "contacts"],
			status: SubscriptionStatus.COMPLETE,
		}).create();
		const differentProgressSubscription = await SubscriptionFactory.merge({
			completedSteps: ["company"],
			status: SubscriptionStatus.DRAFT,
		}).create();
		const differentDateSubscription = await SubscriptionFactory.merge({
			completedSteps: ["company", "contacts"],
			status: SubscriptionStatus.DRAFT,
		}).create();

		for (const subscription of [
			matchingDraftSubscription,
			matchingFinalizedSubscription,
			differentProgressSubscription,
			differentDateSubscription,
		]) {
			await CompanyFactory.merge({ subscriptionId: subscription.id }).create();
		}

		await Subscription.query()
			.whereIn("id", [matchingDraftSubscription.id, matchingFinalizedSubscription.id])
			.update({ createdAt: DateTime.fromISO("2026-09-04T12:00:00.000Z") });
		await Subscription.query()
			.where("id", differentProgressSubscription.id)
			.update({ createdAt: DateTime.fromISO("2026-09-04T12:00:00.000Z") });
		await Subscription.query()
			.where("id", differentDateSubscription.id)
			.update({ createdAt: DateTime.fromISO("2026-09-05T12:00:00.000Z") });

		const response = await client
			.visit("client.subscriptions.list")
			.withGuard("client")
			.loginAs(await UserFactory.create())
			.qs({
				createdAtFrom: "2026-09-04",
				createdAtTo: "2026-09-04",
				progress: 3,
				status: "draft",
			});

		response.assertOk();
		assert.deepEqual(
			response.body().data.map((subscription) => subscription.id),
			[matchingDraftSubscription.id],
		);
		assert.deepEqual(response.body().meta.statusCounts, {
			draft: 1,
			validating: 0,
			finalized: 1,
		});

		const singleDateResponse = await client
			.visit("client.subscriptions.list")
			.withGuard("client")
			.loginAs(await UserFactory.create())
			.qs({ createdAtFrom: "2026-09-04", progress: 3, status: "draft" });

		singleDateResponse.assertOk();
		assert.deepEqual(
			singleDateResponse.body().data.map((subscription) => subscription.id),
			[matchingDraftSubscription.id],
		);
	});

	test("it rejects a creation date range ending before it starts", async ({ client }) => {
		const response = await client
			.visit("client.subscriptions.list")
			.withGuard("client")
			.loginAs(await UserFactory.create())
			.qs({ createdAtFrom: "2026-09-05", createdAtTo: "2026-09-04" });

		response.assertStatus(422);
	});

	test("it rejects an unsupported progress value", async ({ client }) => {
		const response = await client
			.visit("client.subscriptions.list")
			.withGuard("client")
			.loginAs(await UserFactory.create())
			.qs({ progress: 6 });

		response.assertStatus(422);
	});

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
						id: firstCompany.id,
						siren: firstCompany.siren,
						name: firstCompany.name,
					},
				},
			],
		});
		assert.lengthOf(response.body().data, 1);
		assert.sameMembers(Object.keys(response.body().data[0].company), [
			"id",
			"subscriptionId",
			"addressId",
			"paymentDetailId",
			"companyLegalAgentId",
			"companyCorrespondentId",
			"siret",
			"siren",
			"naf",
			"name",
			"legalForm",
			"companyHeadcount",
			"vatNumber",
			"financialYearClosingDay",
			"createdAt",
			"updatedAt",
		]);
	});

	test("it rejects unauthenticated requests", async ({ client }) => {
		const response = await client.visit("client.subscriptions.list");

		response.assertUnauthorized();
		response.assertBodyContains({ code: "E_UNAUTHENTICATED" });
	});
});
