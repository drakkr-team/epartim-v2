import { belongsTo } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";

import { SubscriptionPlanAdhesionSchema } from "#database/schema";
import SubscriptionPlan from "#models/subscription_plan";

export const SubscriptionPlanAdhesionType = {
	PEI_EPARTIM: 1,
	PER_COLI_EPARTIM: 2,
	VOLUNTARY_PARTICIPATION_AGREEMENT: 3,
} as const;

export type SubscriptionPlanAdhesionType =
	(typeof SubscriptionPlanAdhesionType)[keyof typeof SubscriptionPlanAdhesionType];

export default class SubscriptionPlanAdhesion extends SubscriptionPlanAdhesionSchema {
	declare type: SubscriptionPlanAdhesionType;

	@belongsTo(() => SubscriptionPlan)
	declare subscriptionPlan: BelongsTo<typeof SubscriptionPlan>;
}
