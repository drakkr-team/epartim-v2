import { belongsTo } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";

import type { SubscriptionPlanAdhesionType } from "#constants/subscription_plan_adhesion";
import { SubscriptionPlanAdhesionSchema } from "#database/schema";
import SubscriptionPlan from "#models/subscription_plan";

export default class SubscriptionPlanAdhesion extends SubscriptionPlanAdhesionSchema {
	declare type: SubscriptionPlanAdhesionType;

	@belongsTo(() => SubscriptionPlan)
	declare subscriptionPlan: BelongsTo<typeof SubscriptionPlan>;
}
