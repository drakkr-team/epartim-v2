import { inject } from "@adonisjs/core";
import db from "@adonisjs/lucid/services/db";
import { ValidationError } from "@vinejs/vine";
import type { Infer } from "@vinejs/vine/types";

import {
	type SubscriptionMatchingRecordType as MatchingRecordType,
	SubscriptionMatchingDevice,
	SubscriptionMatchingRecordType,
	SubscriptionMatchingRuleType,
} from "#constants/subscription_matching";
import { SubscriptionPlanAdhesionType } from "#constants/subscription_plan_adhesion";
import { SubscriptionStep } from "#features/client/subscriptions/services/steps/step.types";
import ValidateSubscriptionStepService from "#features/client/subscriptions/services/steps/validate.service";
import SubscriptionPlanService from "#features/client/subscriptions/services/update/contract_characteristics/plan.service";
import Subscription from "#models/subscription";
import SubscriptionMatchingRule, {
	type SubscriptionMatchingRuleDetails,
} from "#models/subscription_matching_rule";
import SubscriptionPlanAdhesion from "#models/subscription_plan_adhesion";
import { UpdateSubscriptionMatchingSchema } from "#validators/subscription/contract_characteristics/matching.validator";

type Payload = Infer<typeof UpdateSubscriptionMatchingSchema>;
type SubscriptionDeviceMatching = Payload["matching"];
function normalizeDeviceMatching(matching: SubscriptionDeviceMatching): SubscriptionDeviceMatching {
	const active = new Set(matching.ruleTypes);
	return {
		ruleTypes: matching.ruleTypes,
		uniformRules: active.has(SubscriptionMatchingRuleType.UNIFORM) ? matching.uniformRules : [],
		seniorityRules: active.has(SubscriptionMatchingRuleType.SENIORITY)
			? matching.seniorityRules
			: [],
		unilateralRule: active.has(SubscriptionMatchingRuleType.UNILATERAL)
			? matching.unilateralRule
			: null,
		specificRule: active.size > 0 && matching.specificRule,
		specificRuleDetails:
			active.size > 0 && matching.specificRule
				? matching.specificRuleDetails?.trim() || null
				: null,
	};
}

@inject()
export default class SubscriptionMatchingService {
	constructor(
		protected validateSubscriptionStepService: ValidateSubscriptionStepService,
		protected subscriptionPlanService: SubscriptionPlanService,
	) {}

	async handle(subscription: Subscription, payload: Payload) {
		return db.transaction(async (trx) => {
			await Subscription.query({ client: trx })
				.where("id", subscription.id)
				.forUpdate()
				.firstOrFail();
			const plan = await this.subscriptionPlanService.getOrCreate(subscription.id, trx);
			const requiredAdhesion =
				payload.device === SubscriptionMatchingDevice.PEI
					? SubscriptionPlanAdhesionType.PEI_EPARTIM
					: SubscriptionPlanAdhesionType.PER_COLI_EPARTIM;
			const adhesion = await SubscriptionPlanAdhesion.query({ client: trx })
				.where("subscriptionPlanId", plan.id)
				.where("type", requiredAdhesion)
				.first();
			if (!adhesion) {
				throw new ValidationError([
					{
						field: "device",
						message: "Sélectionnez d’abord le dispositif correspondant.",
						rule: "adhesion",
					},
				]);
			}
			const matching = normalizeDeviceMatching(payload.matching);

			await SubscriptionMatchingRule.query({ client: trx })
				.where("subscriptionPlanId", plan.id)
				.where("device", payload.device)
				.delete();
			const records: Array<{
				subscriptionPlanId: number;
				device: SubscriptionMatchingDevice;
				type: MatchingRecordType;
				details: SubscriptionMatchingRuleDetails;
			}> = matching.ruleTypes.map((type) => ({
				subscriptionPlanId: plan.id,
				device: payload.device,
				type,
				details:
					type === SubscriptionMatchingRuleType.UNIFORM
						? { payments: matching.uniformRules }
						: type === SubscriptionMatchingRuleType.SENIORITY
							? { payments: matching.seniorityRules }
							: (matching.unilateralRule ?? { limitKind: null, limitAmount: null }),
			}));
			if (matching.specificRule) {
				records.push({
					subscriptionPlanId: plan.id,
					device: payload.device,
					type: SubscriptionMatchingRecordType.SPECIFIC,
					details: { description: matching.specificRuleDetails },
				});
			}
			if (records.length) await SubscriptionMatchingRule.createMany(records, { client: trx });
			await this.validateSubscriptionStepService.invalidate(
				subscription,
				trx,
				SubscriptionStep.CONTRACT_CHARACTERISTICS,
			);
			return matching;
		});
	}
}
