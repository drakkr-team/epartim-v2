import db from "@adonisjs/lucid/services/db";
import type { Infer } from "@vinejs/vine/types";

import Address from "#models/address";
import Firm from "#models/firm";
import PaymentDetail from "#models/payment_detail";
import type { CreateFirmSchema } from "#validators/firm.validator";

export type CreateFirmPayload = Infer<typeof CreateFirmSchema>;

export default class CreateFirmService {
	handle(payload: CreateFirmPayload) {
		return db.transaction(async (trx) => {
			const {
				address: addressPayload,
				paymentDetails: paymentDetailsPayload,
				...firmPayload
			} = payload;
			const address = await Address.create(
				{ coordinates: null, ...addressPayload },
				{ client: trx },
			);
			const paymentDetails = await PaymentDetail.create(paymentDetailsPayload, {
				client: trx,
			});
			const firm = await Firm.create(
				{
					...firmPayload,
					networkId: firmPayload.networkId ?? null,
					addressId: address.id,
					paymentDetailsId: paymentDetails.id,
				},
				{ client: trx },
			);

			await firm.load("address");
			await firm.load("paymentDetails");
			return firm;
		});
	}
}
