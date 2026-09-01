import db from "@adonisjs/lucid/services/db";

import Firm from "#models/firm";

export default class DeleteFirmService {
	async handle(firmId: bigint | number | string) {
		const firm = await Firm.findOrFail(firmId);
		await firm.load("address");
		await firm.load("paymentDetail");

		return db.transaction(async (trx) => {
			await firm.useTransaction(trx).delete();
			await firm.address.useTransaction(trx).delete();
			await firm.paymentDetail.useTransaction(trx).delete();
		});
	}
}
