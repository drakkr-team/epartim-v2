export const SubscriptionStep = {
	COMPANY_REFERENCES: 1,
	KYC: 2,
} as const;

export type SubscriptionStep = (typeof SubscriptionStep)[keyof typeof SubscriptionStep];

export function isSubscriptionStep(value: unknown): value is SubscriptionStep {
	return Object.values(SubscriptionStep).includes(value as SubscriptionStep);
}
