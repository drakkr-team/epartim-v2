import { inject } from "@adonisjs/core";
import db from "@adonisjs/lucid/services/db";
import type { TransactionClientContract } from "@adonisjs/lucid/types/database";
import type { Infer } from "@vinejs/vine/types";

import type { SubscriptionPlanAdhesionType } from "#constants/subscription_plan_adhesion";
import { SubscriptionStep } from "#features/client/subscriptions/services/steps/step.types";
import ValidateSubscriptionStepService from "#features/client/subscriptions/services/steps/validate.service";
import SubscriptionPlanService from "#features/client/subscriptions/services/update/contract_characteristics/plan.service";
import Subscription from "#models/subscription";
import SubscriptionPlan from "#models/subscription_plan";
import SubscriptionPlanAdhesion from "#models/subscription_plan_adhesion";
import { UpdateSubscriptionPlanAdhesionsSchema } from "#validators/subscription/contract_characteristics/adhesions.validator";

export type UpdateSubscriptionPlanAdhesionsPayload = Infer<
	typeof UpdateSubscriptionPlanAdhesionsSchema
>;

@inject()
export default class SubscriptionPlanAdhesionsService {
	constructor(
		protected validateSubscriptionStepService: ValidateSubscriptionStepService,
		protected subscriptionPlanService: SubscriptionPlanService,
	) {}

	async handle(subscription: Subscription, payload: UpdateSubscriptionPlanAdhesionsPayload) {
		return db.transaction(async (trx) => {
			await Subscription.query({ client: trx })
				.where("id", subscription.id)
				.forUpdate()
				.firstOrFail();

			const plan = await this.subscriptionPlanService.getOrCreate(subscription.id, trx);
			if (payload.adhesionTypes !== undefined) {
				await this.#replace(plan, payload.adhesionTypes as SubscriptionPlanAdhesionType[], trx);
			}
			await this.validateSubscriptionStepService.invalidate(
				subscription,
				trx,
				SubscriptionStep.CONTRACT_CHARACTERISTICS,
			);

			return this.list(plan, trx);
		});
	}

	async list(plan: SubscriptionPlan, trx: TransactionClientContract) {
		return SubscriptionPlanAdhesion.query({ client: trx })
			.where("subscriptionPlanId", plan.id)
			.orderBy("type");
	}

	async #replace(
		plan: SubscriptionPlan,
		selectedTypes: SubscriptionPlanAdhesionType[],
		trx: TransactionClientContract,
	) {
		if (selectedTypes.length === 0) {
			await SubscriptionPlanAdhesion.query({ client: trx })
				.where("subscriptionPlanId", plan.id)
				.delete();
			return;
		}

		await SubscriptionPlanAdhesion.query({ client: trx })
			.where("subscriptionPlanId", plan.id)
			.whereNotIn("type", selectedTypes)
			.delete();
		const existingAdhesions = await SubscriptionPlanAdhesion.query({ client: trx })
			.where("subscriptionPlanId", plan.id)
			.select("type");
		const existingTypes = new Set(existingAdhesions.map((adhesion) => adhesion.type));
		const additions = selectedTypes.filter((type) => !existingTypes.has(type));

		if (additions.length > 0) {
			await SubscriptionPlanAdhesion.createMany(
				additions.map((type) => ({ subscriptionPlanId: plan.id, type })),
				{ client: trx },
			);
		}
	}
}
