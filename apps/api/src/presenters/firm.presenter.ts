import { inject } from "@adonisjs/core";

import type Firm from "#models/firm";
import AddressPresenter from "#presenters/address.presenter";
import PaymentDetailPresenter from "#presenters/payment_detail.presenter";

@inject()
export default class FirmPresenter {
	constructor(
		protected addressPresenter: AddressPresenter,
		protected paymentDetailPresenter: PaymentDetailPresenter,
	) {}

	toJSON(firm: Firm) {
		return {
			id: firm.id,

			name: firm.name,
			amundiOrgId: firm.amundiOrgId,
			networkId: firm.networkId,
			addressId: firm.addressId,
			paymentDetailsId: firm.paymentDetailsId,
			orias: firm.orias,

			address: this.addressPresenter.toJSON(firm.address),
			paymentDetails: this.paymentDetailPresenter.toJSON(firm.paymentDetails),

			createdAt: firm.createdAt.toJSDate(),
			updatedAt: firm.updatedAt.toJSDate(),
		};
	}
}
