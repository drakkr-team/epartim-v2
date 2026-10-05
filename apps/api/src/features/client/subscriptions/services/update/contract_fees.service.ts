import { inject } from "@adonisjs/core";
import db from "@adonisjs/lucid/services/db";
import type { Infer } from "@vinejs/vine/types";

import {
	getSubscriptionPricingOffer,
	SUBSCRIPTION_PRICING_TERMS,
} from "#constants/subscription_contract_fee";
import { SubscriptionStep } from "#features/client/subscriptions/services/steps/step.types";
import ValidateSubscriptionStepService from "#features/client/subscriptions/services/steps/validate.service";
import Subscription from "#models/subscription";
import SubscriptionContractFee from "#models/subscription_contract_fee";
import SubscriptionContractFeePresenter from "#presenters/subscription_contract_fee.presenter";
import { UpdateSubscriptionContractFeesSchema } from "#validators/subscription/contract_fees.validator";

export type UpdateSubscriptionContractFeesPayload = Infer<
	typeof UpdateSubscriptionContractFeesSchema
>;

@inject()
export default class SubscriptionContractFeesService {
	constructor(
		protected validateSubscriptionStepService: ValidateSubscriptionStepService,
		protected subscriptionContractFeePresenter: SubscriptionContractFeePresenter,
	) {}

	async handle(subscription: Subscription, payload: UpdateSubscriptionContractFeesPayload) {
		return db.transaction(async (trx) => {
			const lockedSubscription = await Subscription.query({ client: trx })
				.where("id", subscription.id)
				.forUpdate()
				.firstOrFail();
			const company = await lockedSubscription.related("company").query().firstOrFail();
			const fees = await SubscriptionContractFee.firstOrNew(
				{ subscriptionId: subscription.id },
				{
					pricingOffer:
						payload.pricingOffer ?? getSubscriptionPricingOffer(company.companyHeadcount),
					entryFeePayer: null,
					entryFeeRateBasisPoints: null,
				},
				{ client: trx },
			);
			const pricingOffer = payload.pricingOffer ?? fees.pricingOffer;
			if (!fees.$isPersisted || pricingOffer !== fees.pricingOffer) {
				const terms = SUBSCRIPTION_PRICING_TERMS[pricingOffer];
				fees.merge({
					pricingOffer,
					annualAccountFeeCents: BigInt(Math.round(terms.annualAccountFee * 100)),
					annualAccountFeePerEmployeeCents: BigInt(
						Math.round(terms.annualAccountFeePerEmployee * 100),
					),
				});
			}
			fees.merge({
				...(payload.entryFeePayer === undefined ? {} : { entryFeePayer: payload.entryFeePayer }),
				...(payload.entryFeeRate === undefined
					? {}
					: {
							entryFeeRateBasisPoints:
								payload.entryFeeRate === null ? null : Math.round(payload.entryFeeRate * 100),
						}),
			});
			await fees.useTransaction(trx).save();
			await this.validateSubscriptionStepService.invalidate(
				subscription,
				trx,
				SubscriptionStep.CONTRACT_FEES,
			);

			return this.subscriptionContractFeePresenter.toJSON(fees, company.companyHeadcount);
		});
	}
}
