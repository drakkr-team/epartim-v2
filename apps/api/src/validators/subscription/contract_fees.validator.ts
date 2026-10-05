import vine from "@vinejs/vine";

import {
	SUBSCRIPTION_MAX_ENTRY_FEE_RATE,
	SubscriptionEntryFeePayer,
	SubscriptionPricingOffer,
} from "#constants/subscription_contract_fee";

export const UpdateSubscriptionContractFeesSchema = vine
	.object({
		pricingOffer: vine.enum(SubscriptionPricingOffer).optional(),
		entryFeePayer: vine.enum(SubscriptionEntryFeePayer).nullable().optional(),
		entryFeeRate: vine
			.number()
			.min(0)
			.max(SUBSCRIPTION_MAX_ENTRY_FEE_RATE)
			.decimal([0, 2])
			.nullable()
			.optional(),
	})
	.partial();
