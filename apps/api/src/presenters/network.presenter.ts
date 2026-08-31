import { inject } from "@adonisjs/core";

import type Network from "#models/network";
import AddressPresenter from "#presenters/address.presenter";
import PaymentDetailPresenter from "#presenters/payment_detail.presenter";

@inject()
export default class NetworkPresenter {
	constructor(
		private addressPresenter: AddressPresenter,
		private paymentDetailPresenter: PaymentDetailPresenter,
	) {}

	toJSON(network: Network) {
		return {
			id: network.id,

			name: network.name,
			amundiOrgId: network.amundiOrgId,
			addressId: network.addressId,
			goCode: network.goCode,
			paymentDetailsId: network.paymentDetailsId,

			address: this.addressPresenter.toJSON(network.address),
			paymentDetails: this.paymentDetailPresenter.toJSON(network.paymentDetails),

			createdAt: network.createdAt.toJSDate(),
			updatedAt: network.updatedAt.toJSDate(),
		};
	}
}
