export const SubscriptionAgreement = {
	PARTICIPATION: "participation",
	INCENTIVES: "incentives",
	PPV: "ppv",
	PPVE: "ppve",
	OTHER: "other_agreement",
} as const;

export type SubscriptionAgreement =
	(typeof SubscriptionAgreement)[keyof typeof SubscriptionAgreement];

export const MinimumSeniorityMonths = [3, 2, 1, 0] as const;
