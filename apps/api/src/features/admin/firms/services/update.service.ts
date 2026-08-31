import db from "@adonisjs/lucid/services/db";
import type { Infer } from "@vinejs/vine/types";

import Firm from "#models/firm";
import type { UpdateFirmSchema } from "#validators/firm.validator";

export type UpdateFirmPayload = Infer<typeof UpdateFirmSchema>;

export default class UpdateFirmService {
	handle(firmId: bigint | number | string, payload: UpdateFirmPayload) {
		return db.transaction(async (trx) => {
			const firm = await Firm.query({ client: trx })
				.where("id", Number(firmId))
				.preload("address")
				.preload("paymentDetails")
				.firstOrFail();
			const {
				address: addressPayload,
				paymentDetails: paymentDetailsPayload,
				...firmPayload
			} = payload;

			if (addressPayload) {
				await firm.address.useTransaction(trx).merge(addressPayload).save();
			}

			if (paymentDetailsPayload) {
				await firm.paymentDetails.useTransaction(trx).merge(paymentDetailsPayload).save();
			}

			await firm.useTransaction(trx).merge(firmPayload).save();
			return firm;
		});
	}
}
