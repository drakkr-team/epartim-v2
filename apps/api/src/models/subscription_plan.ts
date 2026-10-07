import { belongsTo, hasMany } from "@adonisjs/lucid/orm";
import type { BelongsTo, HasMany } from "@adonisjs/lucid/types/relations";

import type {
	SubscriptionMatchingCalculationMethod,
	SubscriptionMatchingDistributionPeriod,
} from "#constants/subscription_matching";
import type {
	SubscriptionParticipationDuration,
	SubscriptionParticipationFormula,
} from "#constants/subscription_participation";
import { SubscriptionPlanSchema } from "#database/schema";
import Subscription from "#models/subscription";
import SubscriptionMatchingRule from "#models/subscription_matching_rule";
import SubscriptionPlanAdhesion from "#models/subscription_plan_adhesion";

export default class SubscriptionPlan extends SubscriptionPlanSchema {
	declare matchingCalculationMethod: SubscriptionMatchingCalculationMethod;
	declare matchingDistributionPeriod: SubscriptionMatchingDistributionPeriod;
	declare voluntaryParticipationDuration: SubscriptionParticipationDuration | null;
	declare voluntaryParticipationFormula: SubscriptionParticipationFormula | null;

	@belongsTo(() => Subscription)
	declare subscription: BelongsTo<typeof Subscription>;

	@hasMany(() => SubscriptionPlanAdhesion)
	declare adhesions: HasMany<typeof SubscriptionPlanAdhesion>;

	@hasMany(() => SubscriptionMatchingRule)
	declare matchingRules: HasMany<typeof SubscriptionMatchingRule>;
}
