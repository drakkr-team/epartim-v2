import z from "zod";

import {
	SUBSCRIPTION_MAX_ENTRY_FEE_RATE,
	SubscriptionEntryFeePayer,
	SubscriptionPricingOffer,
} from "@workspace/api/constants/subscription_contract_fee";

import {
	headcount,
	type SubscriptionSnapshot,
	summarizeCompletion,
	valid,
} from "#/features/subscriptions/steps/completion/completion";

export function contractFeesCompletion(subscription: {
	legalIdentification: Pick<SubscriptionSnapshot["legalIdentification"], "companyHeadcount">;
	contractFees: Pick<
		SubscriptionSnapshot["contractFees"],
		"pricingOffer" | "entryFeePayer" | "entryFeeRate"
	>;
}) {
	// The default pricing offer is derived from headcount; null must not mean "under eleven".
	if (!valid(headcount, Number(subscription.legalIdentification.companyHeadcount))) return null;
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
