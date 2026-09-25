export const SubscriptionPlanAdhesionType = {
	PEI_EPARTIM: 1,
	PER_COLI_EPARTIM: 2,
	VOLUNTARY_PARTICIPATION_AGREEMENT: 3,
} as const;

export type SubscriptionPlanAdhesionType =
	(typeof SubscriptionPlanAdhesionType)[keyof typeof SubscriptionPlanAdhesionType];
