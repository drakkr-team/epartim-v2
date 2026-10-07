import { test } from "@japa/runner";

import { SubscriptionPlanAdhesionType } from "#constants/subscription_plan_adhesion";
import { CompanyFactory } from "#database/factories/company.factory";
import { SubscriptionFactory } from "#database/factories/subscription.factory";
import { UserFactory } from "#database/factories/user.factory";
import SubscriptionPlan from "#models/subscription_plan";
import SubscriptionPlanAdhesion from "#models/subscription_plan_adhesion";

test.group(
	"Features / Client / Subscriptions / Controllers / Update Contract Characteristics Adhesions",
	() => {
		async function createSubscription() {
			const user = await UserFactory.create();
			const subscription = await SubscriptionFactory.merge({ createdBy: user.id }).create();
			await CompanyFactory.merge({
				subscriptionId: subscription.id,
				companyHeadcount: "50",
			}).create();

			return { subscription, user };
		}

		test("it replaces the selected adhesions", async ({ client, assert }) => {
			const { subscription, user } = await createSubscription();

			const response = await client
				.visit("client.subscriptions.update_contract_characteristics_adhesions", {
					subscriptionId: subscription.id,
				})
				.withGuard("client")
				.loginAs(user)
				.json({
					adhesionTypes: [
						SubscriptionPlanAdhesionType.PEI_EPARTIM,
						SubscriptionPlanAdhesionType.VOLUNTARY_PARTICIPATION_AGREEMENT,
					],
				});

			response.assertOk();
			const plan = await SubscriptionPlan.findByOrFail("subscriptionId", subscription.id);
			assert.deepEqual(
				(
					await SubscriptionPlanAdhesion.query()
						.where("subscriptionPlanId", plan.id)
						.orderBy("type")
				).map((adhesion) => adhesion.type),
				[
					SubscriptionPlanAdhesionType.PEI_EPARTIM,
					SubscriptionPlanAdhesionType.VOLUNTARY_PARTICIPATION_AGREEMENT,
				],
			);

			const replacementResponse = await client
				.visit("client.subscriptions.update_contract_characteristics_adhesions", {
					subscriptionId: subscription.id,
				})
				.withGuard("client")
				.loginAs(user)
				.json({ adhesionTypes: [SubscriptionPlanAdhesionType.PER_COLI_EPARTIM] });

			replacementResponse.assertOk();
			assert.deepEqual(
				(
					await SubscriptionPlanAdhesion.query()
						.where("subscriptionPlanId", plan.id)
						.orderBy("type")
				).map((adhesion) => adhesion.type),
				[SubscriptionPlanAdhesionType.PER_COLI_EPARTIM],
			);
		});

		test("it rejects invalid adhesion types", async ({ client }) => {
			const { subscription, user } = await createSubscription();
			const response = await client
				.visit("client.subscriptions.update_contract_characteristics_adhesions", {
					subscriptionId: subscription.id,
				})
				.withGuard("client")
				.loginAs(user)
				.unsafeJson({ adhesionTypes: [999] });

			response.assertStatus(422);
		});
	},
);
