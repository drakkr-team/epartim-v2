import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";

import DeleteNetworkPolicy from "#features/admin/networks/policies/delete.policy";
import UpdateNetworkPolicy from "#features/admin/networks/policies/update.policy";
import ViewNetworkPolicy from "#features/admin/networks/policies/view.policy";
import Network from "#models/network";
import AddressPresenter from "#presenters/address.presenter";
import CommissionRatePresenter from "#presenters/commission_rate.presenter";
import NetworkPresenter from "#presenters/network.presenter";
import PaymentDetailPresenter from "#presenters/payment_detail.presenter";

@inject()
export default class ViewNetworkController {
	constructor(
		protected networkPresenter: NetworkPresenter,
		protected addressPresenter: AddressPresenter,
		protected paymentDetailPresenter: PaymentDetailPresenter,
		protected commissionRatePresenter: CommissionRatePresenter,
	) {}

	async handle({ params, bouncer }: HttpContext) {
		const { networkId } = params;

		await bouncer.with(ViewNetworkPolicy).authorize("handle");

		const network = await Network.findOrFail(networkId);
		const addressPromise = network.load("address");
		const paymentDetailsPromise = network.load("paymentDetail");
		const commissionRatePromise = network.load("commissionRate");
		await Promise.all([addressPromise, paymentDetailsPromise, commissionRatePromise]);

		return {
			...this.networkPresenter.toJSON(network),
			address: this.addressPresenter.toJSON(network.address),
			paymentDetail: this.paymentDetailPresenter.toJSON(network.paymentDetail),
			commissionRate: this.commissionRatePresenter.toJSON(network.commissionRate),
			meta: {
				canUpdate: await bouncer.with(UpdateNetworkPolicy).allows("handle"),
				canDelete: await bouncer.with(DeleteNetworkPolicy).allows("handle"),
			},
		};
	}
}
