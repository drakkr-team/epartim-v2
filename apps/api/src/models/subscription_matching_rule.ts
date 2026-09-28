import { belongsTo } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";

import type {
	SubscriptionMatchingDevice,
	SubscriptionMatchingLimitKind,
	SubscriptionMatchingPaymentType,
	SubscriptionMatchingRecordType,
} from "#constants/subscription_matching";
import { SubscriptionMatchingRuleSchema } from "#database/schema";
import SubscriptionPlan from "#models/subscription_plan";

export type SubscriptionMatchingPeriod = {
	fromYears: number | null;
	toYears: number | null;
	rate: number | null;
	limitKind: SubscriptionMatchingLimitKind | null;
	limitAmount: number | null;
};

export type SubscriptionUniformRule = Omit<SubscriptionMatchingPeriod, "fromYears" | "toYears"> & {
	paymentType: SubscriptionMatchingPaymentType;
};

export type SubscriptionSeniorityRule = {
	paymentType: SubscriptionMatchingPaymentType;
	periods: SubscriptionMatchingPeriod[];
};

export type SubscriptionUnilateralRule = {
	limitKind: SubscriptionMatchingLimitKind | null;
	limitAmount: number | null;
};

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
