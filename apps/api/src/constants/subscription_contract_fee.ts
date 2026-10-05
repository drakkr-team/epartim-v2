export const SubscriptionPricingOffer = {
	UNDER_ELEVEN_EMPLOYEES: 1,
	ELEVEN_OR_MORE_EMPLOYEES: 2,
} as const;

export type SubscriptionPricingOffer =
	(typeof SubscriptionPricingOffer)[keyof typeof SubscriptionPricingOffer];

export const SubscriptionEntryFeePayer = {
	SAVERS: 1,
	COMPANY: 2,
} as const;

export type SubscriptionEntryFeePayer =
	(typeof SubscriptionEntryFeePayer)[keyof typeof SubscriptionEntryFeePayer];

export const SUBSCRIPTION_MAX_ENTRY_FEE_RATE = 4.5;

export const SUBSCRIPTION_PRICING_TERMS = {
	[SubscriptionPricingOffer.UNDER_ELEVEN_EMPLOYEES]: {
		annualAccountFee: 200,
		annualAccountFeePerEmployee: 0,
	},
	[SubscriptionPricingOffer.ELEVEN_OR_MORE_EMPLOYEES]: {
		annualAccountFee: 115,
		annualAccountFeePerEmployee: 15,
	},
} satisfies Record<
	SubscriptionPricingOffer,
	{
		annualAccountFee: number;
		annualAccountFeePerEmployee: number;
	}
>;

export function getSubscriptionPricingOffer(companyHeadcount: string | null) {
	return Number(companyHeadcount) >= 11
		? SubscriptionPricingOffer.ELEVEN_OR_MORE_EMPLOYEES
		: SubscriptionPricingOffer.UNDER_ELEVEN_EMPLOYEES;
}
