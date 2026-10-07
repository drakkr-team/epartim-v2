import z from "zod";

import {
	SUBSCRIPTION_MAX_ENTRY_FEE_RATE,
	SubscriptionEntryFeePayer,
	SubscriptionPricingOffer,
} from "@workspace/api/constants/subscription_contract_fee";

import {
	type SubscriptionSnapshot,
	summarizeCompletion,
	valid,
} from "#/features/subscriptions/steps/completion/completion";

export function contractFeesCompletion(subscription: {
	contractFees: Pick<
		SubscriptionSnapshot["contractFees"],
		"pricingOffer" | "entryFeePayer" | "entryFeeRate"
	>;
}) {
	const fees = subscription.contractFees;
	return summarizeCompletion([
		valid(z.enum(SubscriptionPricingOffer), fees.pricingOffer),
		valid(z.enum(SubscriptionEntryFeePayer), fees.entryFeePayer),
		valid(
			z.number().min(0).max(SUBSCRIPTION_MAX_ENTRY_FEE_RATE).multipleOf(0.01),
			fees.entryFeeRate,
		),
	]);
}
