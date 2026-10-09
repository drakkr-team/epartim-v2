import { inject } from "@adonisjs/core";
import db from "@adonisjs/lucid/services/db";
import type { TransactionClientContract } from "@adonisjs/lucid/types/database";
import { ValidationError } from "@vinejs/vine";
import type { Infer } from "@vinejs/vine/types";

import { SubscriptionMatchingDevice } from "#constants/subscription_matching";
import { canSelectVoluntaryParticipation } from "#constants/subscription_participation";
import type { SubscriptionPlanAdhesionType } from "#constants/subscription_plan_adhesion";
import { SubscriptionPlanAdhesionType as AdhesionType } from "#constants/subscription_plan_adhesion";
import { SubscriptionStep } from "#features/client/subscriptions/services/steps/step.types";
import ValidateSubscriptionStepService from "#features/client/subscriptions/services/steps/validate.service";
import SubscriptionPlanService from "#features/client/subscriptions/services/update/contract_characteristics/plan.service";
import SubscriptionFormalismService from "#features/client/subscriptions/services/update/formalism/formalism.service";
import Company from "#models/company";
import Subscription from "#models/subscription";
import SubscriptionMatchingRule from "#models/subscription_matching_rule";
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
		protected formalismService: SubscriptionFormalismService,
	) {}

	async handle(subscription: Subscription, payload: UpdateSubscriptionPlanAdhesionsPayload) {
		return db.transaction(async (trx) => {
			await Subscription.query({ client: trx })
				.where("id", subscription.id)
				.forUpdate()
				.firstOrFail();

			const plan = await this.subscriptionPlanService.getOrCreate(subscription.id, trx);
			if (payload.adhesionTypes !== undefined) {
				const previous = await this.list(plan, trx);
				if (
					payload.adhesionTypes.includes(AdhesionType.VOLUNTARY_PARTICIPATION_AGREEMENT) &&
					!previous.some(
						(adhesion) => adhesion.type === AdhesionType.VOLUNTARY_PARTICIPATION_AGREEMENT,
					)
				) {
					const company = await Company.findBy("subscriptionId", subscription.id, { client: trx });
					if (!canSelectVoluntaryParticipation(company?.companyHeadcount))
						throw new ValidationError([
							{
								field: "adhesionTypes",
								message:
									"L’accord de participation volontaire nécessite un effectif renseigné de 50 salariés ou moins.",
								rule: "headcount",
							},
						]);
				}
				const changed =
					previous.length !== payload.adhesionTypes.length ||
					previous.some((adhesion) => !payload.adhesionTypes?.includes(adhesion.type));
				await this.#replace(plan, payload.adhesionTypes as SubscriptionPlanAdhesionType[], trx);
				if (changed) await this.formalismService.synchronize(subscription, trx);
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
		if (!selectedTypes.includes(AdhesionType.VOLUNTARY_PARTICIPATION_AGREEMENT)) {
			this.subscriptionPlanService.clearVoluntaryParticipation(plan);
			await plan.useTransaction(trx).save();
		}
		if (selectedTypes.length === 0) {
			await SubscriptionPlanAdhesion.query({ client: trx })
				.where("subscriptionPlanId", plan.id)
				.delete();
			await SubscriptionMatchingRule.query({ client: trx })
				.where("subscriptionPlanId", plan.id)
				.delete();
			return;
		}
		const selectedDevices = [
			...(selectedTypes.includes(AdhesionType.PEI_EPARTIM) ? [SubscriptionMatchingDevice.PEI] : []),
			...(selectedTypes.includes(AdhesionType.PER_COLI_EPARTIM)
				? [SubscriptionMatchingDevice.PER]
				: []),
		];
		if (selectedDevices.length === 0) {
			await SubscriptionMatchingRule.query({ client: trx })
				.where("subscriptionPlanId", plan.id)
				.delete();
		} else {
			await SubscriptionMatchingRule.query({ client: trx })
				.where("subscriptionPlanId", plan.id)
				.whereNotIn("device", selectedDevices)
				.delete();
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
