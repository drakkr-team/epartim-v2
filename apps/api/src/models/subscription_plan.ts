import { belongsTo, column, hasMany } from "@adonisjs/lucid/orm";
import type { BelongsTo, HasMany } from "@adonisjs/lucid/types/relations";

import type { SubscriptionAgreement } from "#constants/subscription_agreement";
import { SubscriptionPlanSchema } from "#database/schema";
import Subscription from "#models/subscription";
import SubscriptionPlanAdhesion from "#models/subscription_plan_adhesion";
import { jsonColumn } from "#src/utils/json_column";

export default class SubscriptionPlan extends SubscriptionPlanSchema {
	@column(jsonColumn<SubscriptionAgreement[]>())
	declare existingAgreements: SubscriptionAgreement[];

	@belongsTo(() => Subscription)
	declare subscription: BelongsTo<typeof Subscription>;

	@hasMany(() => SubscriptionPlanAdhesion)
	declare adhesions: HasMany<typeof SubscriptionPlanAdhesion>;
}
