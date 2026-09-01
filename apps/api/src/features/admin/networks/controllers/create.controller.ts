import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import db from "@adonisjs/lucid/services/db";
import vine from "@vinejs/vine";

import CreateNetworkPolicy from "#features/admin/networks/policies/create.policy";
import Address from "#models/address";
import Network from "#models/network";
import PaymentDetail from "#models/payment_detail";
import NetworkPresenter from "#presenters/network.presenter";
import { CreateNetworkSchema } from "#validators/network.validator";

@inject()
export default class CreateNetworkController {
	constructor(protected networkPresenter: NetworkPresenter) {}

	async handle({ request, response, bouncer }: HttpContext) {
		await bouncer.with(CreateNetworkPolicy).authorize("handle");

		const {
			address: addressPayload,
			paymentDetail: paymentDetailPayload,
			...networkPayload
		} = await request.validateUsing(CreateNetworkController.payloadSchema);

		const network = await db.transaction(async (trx) => {
			const address = await Address.create(addressPayload, { client: trx });
			const paymentDetail = await PaymentDetail.create(paymentDetailPayload, { client: trx });
			const network = await Network.create(
				{
					...networkPayload,
					addressId: address.id,
					paymentDetailId: paymentDetail.id,
				},
				{ client: trx },
			);

			return network;
		});

		return response.created(this.networkPresenter.toJSON(network));
	}

	static payloadSchema = vine.create(CreateNetworkSchema);
}
