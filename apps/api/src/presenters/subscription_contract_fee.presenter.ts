import {
	getSubscriptionPricingOffer,
	SUBSCRIPTION_PRICING_TERMS,
} from "#constants/subscription_contract_fee";
import type SubscriptionContractFee from "#models/subscription_contract_fee";

export default class SubscriptionContractFeePresenter {
	toJSON(fees: SubscriptionContractFee | null, companyHeadcount: string | null) {
		const pricingOffer = fees?.pricingOffer ?? getSubscriptionPricingOffer(companyHeadcount);
		const terms = SUBSCRIPTION_PRICING_TERMS[pricingOffer];

		return {
			pricingOffer,
			annualAccountFee: fees ? Number(fees.annualAccountFeeCents) / 100 : terms.annualAccountFee,
			annualAccountFeePerEmployee: fees
				? Number(fees.annualAccountFeePerEmployeeCents) / 100
				: terms.annualAccountFeePerEmployee,
			entryFeePayer: fees?.entryFeePayer ?? null,
			entryFeeRate:
				fees?.entryFeeRateBasisPoints == null ? null : fees.entryFeeRateBasisPoints / 100,
		};
	}
}
