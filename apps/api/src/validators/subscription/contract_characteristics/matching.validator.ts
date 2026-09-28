import vine from "@vinejs/vine";

import {
	SubscriptionMatchingDevice,
	SubscriptionMatchingLimitKind,
	SubscriptionMatchingPaymentType,
	SubscriptionMatchingRuleType,
} from "#constants/subscription_matching";

const limitKind = vine.enum(SubscriptionMatchingLimitKind).nullable();
const limitAmount = vine.number().positive().decimal([0, 2]).nullable();
const rate = vine.number().positive().max(300).nullable();

export const UpdateSubscriptionMatchingSchema = vine.object({
	device: vine.enum(SubscriptionMatchingDevice),
	matching: vine.object({
		ruleTypes: vine.array(vine.enum(SubscriptionMatchingRuleType)).maxLength(3).distinct(),
		uniformRules: vine
			.array(
				vine.object({
					paymentType: vine.enum(SubscriptionMatchingPaymentType),
					rate,
					limitKind,
					limitAmount,
				}),
			)
			.maxLength(5),
		seniorityRules: vine
			.array(
				vine.object({
					paymentType: vine.enum(SubscriptionMatchingPaymentType),
					periods: vine
						.array(
							vine.object({
								fromYears: vine.number().min(0).nullable(),
								toYears: vine.number().min(0).nullable(),
								rate,
								limitKind,
								limitAmount,
							}),
						)
						.minLength(1)
						.maxLength(5),
				}),
			)
			.maxLength(5),
		unilateralRule: vine
			.object({
				limitKind,
				limitAmount,
			})
			.nullable(),
		specificRule: vine.boolean(),
		specificRuleDetails: vine.string().trim().nullable(),
	}),
});
