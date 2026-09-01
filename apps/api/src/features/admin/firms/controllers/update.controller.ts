import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import db from "@adonisjs/lucid/services/db";
import vine from "@vinejs/vine";

import UpdateFirmPolicy from "#features/admin/firms/policies/update.policy";
import Address from "#models/address";
import Firm from "#models/firm";
import PaymentDetail from "#models/payment_detail";
import FirmPresenter from "#presenters/firm.presenter";
import { UpdateFirmSchema } from "#validators/firm.validator";

@inject()
export default class UpdateFirmController {
	constructor(protected firmPresenter: FirmPresenter) {}

	async handle({ params, request, bouncer }: HttpContext) {
		const { firmId } = params;

		await bouncer.with(UpdateFirmPolicy).authorize("handle");

		const {
			address: addressPayload,
			paymentDetail: paymentDetailPayload,
			...firmPayload
		} = await request.validateUsing(UpdateFirmController.payloadSchema);

		const firm = await Firm.findOrFail(firmId);

		await db.transaction(async (trx) => {
			if (addressPayload) {
				const address = await Address.findOrFail(firm.addressId, { client: trx });
				await address.useTransaction(trx).merge(addressPayload).save();
			}

			if (paymentDetailPayload) {
				const paymentDetail = await PaymentDetail.findOrFail(firm.paymentDetailId, { client: trx });
				await paymentDetail.useTransaction(trx).merge(paymentDetailPayload).save();
			}

			await firm.useTransaction(trx).merge(firmPayload).save();
		});

		return this.firmPresenter.toJSON(firm);
	}

	static payloadSchema = vine.create(UpdateFirmSchema);
}
