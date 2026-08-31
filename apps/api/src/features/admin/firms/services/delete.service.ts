import db from "@adonisjs/lucid/services/db";

import Firm from "#models/firm";

export default class DeleteFirmService {
	handle(firmId: bigint | number | string) {
		return db.transaction(async (trx) => {
			const firm = await Firm.query({ client: trx })
				.where("id", Number(firmId))
				.preload("address")
				.preload("paymentDetails")
				.firstOrFail();

			await firm.useTransaction(trx).delete();
			await firm.address.useTransaction(trx).delete();
			await firm.paymentDetails.useTransaction(trx).delete();
		});
	}
}
