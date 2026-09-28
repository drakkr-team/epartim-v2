export const SubscriptionMatchingCalculationMethod = {
	AMUNDI: "amundi",
	COMPANY: "company",
} as const;

export type SubscriptionMatchingCalculationMethod =
	(typeof SubscriptionMatchingCalculationMethod)[keyof typeof SubscriptionMatchingCalculationMethod];

export const SubscriptionMatchingDistributionPeriod = {
	YEARS: "years",
	TRIMESTER: "trimester",
	SEMESTER: "semester",
} as const;

export type SubscriptionMatchingDistributionPeriod =
	(typeof SubscriptionMatchingDistributionPeriod)[keyof typeof SubscriptionMatchingDistributionPeriod];
