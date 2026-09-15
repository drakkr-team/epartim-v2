import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";

import Subscription from "#models/subscription";
import AddressPresenter from "#presenters/address.presenter";
import CompanyPresenter from "#presenters/company.presenter";
import PaymentDetailPresenter from "#presenters/payment_detail.presenter";
import SubscriptionPresenter from "#presenters/subscription.presenter";

@inject()
export default class ViewSubscriptionController {
	constructor(
		protected subscriptionPresenter: SubscriptionPresenter,
		protected companyPresenter: CompanyPresenter,
		protected addressPresenter: AddressPresenter,
		protected paymentDetailPresenter: PaymentDetailPresenter,
	) {}

	async handle({ params }: HttpContext) {
		const subscription = await Subscription.findOrFail(params.subscriptionId);
		await subscription.load("company");
		const address = subscription.company.addressId
			? await subscription.company.related("address").query().first()
			: null;
		const paymentDetail = subscription.company.paymentDetailId
			? await subscription.company.related("paymentDetail").query().first()
			: null;

		return {
			...this.subscriptionPresenter.toJSON(subscription),
			legalIdentification: this.companyPresenter.toJSON(subscription.company),
			addressAndBankDetails: {
				address: address ? this.addressPresenter.toJSON(address) : null,
				paymentDetail: paymentDetail ? this.paymentDetailPresenter.toJSON(paymentDetail) : null,
			},
		};
	}
}
