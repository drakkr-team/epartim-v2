import { belongsTo } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";

import type {
	SubscriptionEntryFeePayer,
	SubscriptionPricingOffer,
} from "#constants/subscription_contract_fee";
import { SubscriptionContractFeeSchema } from "#database/schema";
import Subscription from "#models/subscription";

export default class SubscriptionContractFee extends SubscriptionContractFeeSchema {
	declare pricingOffer: SubscriptionPricingOffer;
	declare entryFeePayer: SubscriptionEntryFeePayer | null;

	@belongsTo(() => Subscription)
	declare subscription: BelongsTo<typeof Subscription>;
}
