export const SubscriptionAgreement = {
	PARTICIPATION: 1,
	INCENTIVES: 2,
	PPV: 3,
	PPVE: 4,
	OTHER: 5,
} as const;

export type SubscriptionAgreement =
	(typeof SubscriptionAgreement)[keyof typeof SubscriptionAgreement];

export const MinimumSeniorityMonths = [3, 2, 1, 0] as const;
