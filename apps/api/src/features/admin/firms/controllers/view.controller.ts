import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";

import DeleteFirmPolicy from "#features/admin/firms/policies/delete.policy";
import UpdateFirmPolicy from "#features/admin/firms/policies/update.policy";
import ViewFirmPolicy from "#features/admin/firms/policies/view.policy";
import Firm from "#models/firm";
import AddressPresenter from "#presenters/address.presenter";
import FirmPresenter from "#presenters/firm.presenter";
import NetworkPresenter from "#presenters/network.presenter";
import PaymentDetailPresenter from "#presenters/payment_detail.presenter";

@inject()
export default class ViewFirmController {
	constructor(
		protected firmPresenter: FirmPresenter,
		protected addressPresenter: AddressPresenter,
		protected paymentDetailPresenter: PaymentDetailPresenter,
		protected networkPresenter: NetworkPresenter,
	) {}

	async handle({ params, bouncer }: HttpContext) {
		const { firmId } = params;

		await bouncer.with(ViewFirmPolicy).authorize("handle");

		const firm = await Firm.findOrFail(firmId);
		await firm.load("address");
		await firm.load("paymentDetail");
		await firm.load("network");

		return {
			...this.firmPresenter.toJSON(firm),
			address: this.addressPresenter.toJSON(firm.address),
			paymentDetail: this.paymentDetailPresenter.toJSON(firm.paymentDetail),
			network: this.networkPresenter.toJSON(firm.network),
			meta: {
				canUpdate: await bouncer.with(UpdateFirmPolicy).allows("handle"),
				canDelete: await bouncer.with(DeleteFirmPolicy).allows("handle"),
			},
		};
	}
}
