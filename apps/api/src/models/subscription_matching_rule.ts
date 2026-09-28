import { belongsTo } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";

import type {
	SubscriptionMatchingDevice,
	SubscriptionMatchingRecordType,
	SubscriptionSeniorityRule,
	SubscriptionUniformRule,
	SubscriptionUnilateralRule,
} from "#constants/subscription_matching_rules";
import { SubscriptionMatchingRuleSchema } from "#database/schema";
import SubscriptionPlan from "#models/subscription_plan";

export type SubscriptionMatchingRuleDetails =
	| { payments: SubscriptionUniformRule[] }
	| { payments: SubscriptionSeniorityRule[] }
	| SubscriptionUnilateralRule
	| { description: string | null };

export default class SubscriptionMatchingRule extends SubscriptionMatchingRuleSchema {
	declare device: SubscriptionMatchingDevice;
	declare type: SubscriptionMatchingRecordType;
	declare details: SubscriptionMatchingRuleDetails;

	@belongsTo(() => SubscriptionPlan)
	declare subscriptionPlan: BelongsTo<typeof SubscriptionPlan>;
}
