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
