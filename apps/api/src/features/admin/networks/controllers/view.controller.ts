import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";

import DeleteNetworkPolicy from "#features/admin/networks/policies/delete.policy";
import UpdateNetworkPolicy from "#features/admin/networks/policies/update.policy";
import ViewNetworkPolicy from "#features/admin/networks/policies/view.policy";
import Network from "#models/network";
import AddressPresenter from "#presenters/address.presenter";
import NetworkPresenter from "#presenters/network.presenter";
import PaymentDetailPresenter from "#presenters/payment_detail.presenter";

@inject()
export default class ViewNetworkController {
	constructor(
		protected networkPresenter: NetworkPresenter,
		protected addressPresenter: AddressPresenter,
		protected paymentDetailPresenter: PaymentDetailPresenter,
	) {}

	async handle({ params, bouncer }: HttpContext) {
		const { networkId } = params;

		await bouncer.with(ViewNetworkPolicy).authorize("handle");

		const network = await Network.findOrFail(networkId);
		const addressPromise = network.load("address");
		const paymentDetailsPromise = network.load("paymentDetails");
		await Promise.all([addressPromise, paymentDetailsPromise]);

		return {
			...this.networkPresenter.toJSON(network),
			address: this.addressPresenter.toJSON(network.address),
			paymentDetail: this.paymentDetailPresenter.toJSON(network.paymentDetails),
			meta: {
				canUpdate: await bouncer.with(UpdateNetworkPolicy).allows("handle"),
				canDelete: await bouncer.with(DeleteNetworkPolicy).allows("handle"),
			},
		};
	}
}
