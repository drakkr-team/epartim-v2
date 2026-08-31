import db from "@adonisjs/lucid/services/db";

import Address from "#models/address";
import Network from "#models/network";
import PaymentDetail from "#models/payment_detail";

export default class DeleteNetworkService {
	handle(network: Network) {
		return db.transaction(async (trx) => {
			await Network.query({ client: trx }).where("id", String(network.id)).delete();
			await Address.query({ client: trx }).where("id", String(network.addressId)).delete();
			await PaymentDetail.query({ client: trx })
				.where("id", String(network.paymentDetailId))
				.delete();
		});
	}
}
