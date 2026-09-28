export const SubscriptionMatchingCalculationMethod = {
	AMUNDI: 1,
	COMPANY: 2,
} as const;

export type SubscriptionMatchingCalculationMethod =
	(typeof SubscriptionMatchingCalculationMethod)[keyof typeof SubscriptionMatchingCalculationMethod];

export const SubscriptionMatchingDistributionPeriod = {
	YEARS: 1,
	TRIMESTER: 2,
	SEMESTER: 3,
} as const;

export type SubscriptionMatchingDistributionPeriod =
	(typeof SubscriptionMatchingDistributionPeriod)[keyof typeof SubscriptionMatchingDistributionPeriod];

export const SubscriptionMatchingDevice = {
	PEI: 1,
	PER: 2,
} as const;

export type SubscriptionMatchingDevice =
	(typeof SubscriptionMatchingDevice)[keyof typeof SubscriptionMatchingDevice];

export const SubscriptionMatchingRuleType = {
	UNIFORM: 1,
	SENIORITY: 2,
	UNILATERAL: 3,
} as const;

export type SubscriptionMatchingRuleType =
	(typeof SubscriptionMatchingRuleType)[keyof typeof SubscriptionMatchingRuleType];

export const SubscriptionMatchingRecordType = {
	...SubscriptionMatchingRuleType,
	SPECIFIC: 4,
} as const;

export type SubscriptionMatchingRecordType =
	(typeof SubscriptionMatchingRecordType)[keyof typeof SubscriptionMatchingRecordType];

export const SubscriptionMatchingPaymentType = {
	VOLUNTARY: 1,
	INCENTIVES: 2,
	PARTICIPATION: 3,
	PPV: 4,
	PAID_LEAVE: 5,
} as const;

export type SubscriptionMatchingPaymentType =
	(typeof SubscriptionMatchingPaymentType)[keyof typeof SubscriptionMatchingPaymentType];

export const SubscriptionMatchingLimitKind = {
	LEGAL: 1,
	AMOUNT: 2,
} as const;

export type SubscriptionMatchingLimitKind =
	(typeof SubscriptionMatchingLimitKind)[keyof typeof SubscriptionMatchingLimitKind];
