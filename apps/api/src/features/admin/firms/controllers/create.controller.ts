import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import db from "@adonisjs/lucid/services/db";
import vine from "@vinejs/vine";

import CreateFirmPolicy from "#features/admin/firms/policies/create.policy";
import Address from "#models/address";
import Firm from "#models/firm";
import PaymentDetail from "#models/payment_detail";
import FirmPresenter from "#presenters/firm.presenter";
import { CreateFirmSchema } from "#validators/firm.validator";

@inject()
export default class CreateFirmController {
	constructor(protected firmPresenter: FirmPresenter) {}

	async handle({ request, response, bouncer }: HttpContext) {
		await bouncer.with(CreateFirmPolicy).authorize("handle");

		const {
			address: addressPayload,
			paymentDetail: paymentDetailPayload,
			...firmPayload
		} = await request.validateUsing(CreateFirmController.payloadSchema);

		const firm = await db.transaction(async (trx) => {
			const address = await Address.create(addressPayload, { client: trx });
			const paymentDetail = await PaymentDetail.create(paymentDetailPayload, { client: trx });
			const firm = await Firm.create(
				{
					...firmPayload,
					addressId: address.id,
					paymentDetailId: paymentDetail.id,
				},
				{ client: trx },
			);

			return firm;
		});

		return response.created(this.firmPresenter.toJSON(firm));
	}

	static payloadSchema = vine.create(CreateFirmSchema);
}
