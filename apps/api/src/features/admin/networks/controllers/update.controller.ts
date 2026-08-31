import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import db from "@adonisjs/lucid/services/db";
import vine from "@vinejs/vine";

import UpdateNetworkPolicy from "#features/admin/networks/policies/update.policy";
import Address from "#models/address";
import Network from "#models/network";
import PaymentDetail from "#models/payment_detail";
import NetworkPresenter from "#presenters/network.presenter";
import { UpdateNetworkSchema } from "#validators/network.validator";

@inject()
export default class UpdateNetworkController {
	constructor(protected networkPresenter: NetworkPresenter) {}

	async handle({ params, request, bouncer }: HttpContext) {
		const { networkId } = params;

		await bouncer.with(UpdateNetworkPolicy).authorize("handle");

		const {
			address: addressPayload,
			paymentDetail: paymentDetailPayload,
			...networkPayload
		} = await request.validateUsing(UpdateNetworkController.payloadSchema);

		const network = await Network.findOrFail(networkId);

		await db.transaction(async (trx) => {
			if (addressPayload) {
				const address = await Address.findOrFail(network.addressId, { client: trx });
				await address.useTransaction(trx).merge(addressPayload).save();
			}

			if (paymentDetailPayload) {
				const paymentDetail = await PaymentDetail.findOrFail(network.paymentDetailId, {
					client: trx,
				});
				await paymentDetail.useTransaction(trx).merge(paymentDetailPayload).save();
			}

			await network.useTransaction(trx).merge(networkPayload).save();
		});

		return this.networkPresenter.toJSON(network);
	}

	static payloadSchema = vine.create(UpdateNetworkSchema);
}
