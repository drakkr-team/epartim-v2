import { belongsTo, hasMany } from "@adonisjs/lucid/orm";
import type { BelongsTo, HasMany } from "@adonisjs/lucid/types/relations";

import { SubscriptionPlanSchema } from "#database/schema";
import Subscription from "#models/subscription";
import SubscriptionPlanAdhesion from "#models/subscription_plan_adhesion";

export default class SubscriptionPlan extends SubscriptionPlanSchema {
	@belongsTo(() => Subscription)
	declare subscription: BelongsTo<typeof Subscription>;

	@hasMany(() => SubscriptionPlanAdhesion)
	declare adhesions: HasMany<typeof SubscriptionPlanAdhesion>;
}
