import db from "@adonisjs/lucid/services/db";

import Network from "#models/network";

export default class DeleteNetworkService {
	async handle(networkId: bigint | number | string) {
		const network = await Network.findOrFail(networkId);
		await network.load("address");
		await network.load("paymentDetail");

		return db.transaction(async (trx) => {
			await network.useTransaction(trx).delete();
			await network.address.useTransaction(trx).delete();
			await network.paymentDetail.useTransaction(trx).delete();
		});
	}
}
