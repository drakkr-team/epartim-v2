import db from "@adonisjs/lucid/services/db";

import NetworkHasFirmsException from "#exceptions/network_has_firms.exception";
import Address from "#models/address";
import Firm from "#models/firm";
import Network from "#models/network";
import PaymentDetail from "#models/payment_detail";

export default class DeleteNetworkService {
	execute(networkId: string | number | bigint) {
		return db.transaction(async (transaction) => {
			const network = await Network.query({ client: transaction })
				.where("id", String(networkId))
				.forUpdate()
				.firstOrFail();
			const referencingFirm = await Firm.query({ client: transaction })
				.where("network_id", String(network.id))
				.first();

			if (referencingFirm) {
				throw new NetworkHasFirmsException();
			}

			const address = await Address.query({ client: transaction })
				.where("id", String(network.addressId))
				.firstOrFail();
			const paymentDetails = await PaymentDetail.query({ client: transaction })
				.where("id", String(network.paymentDetailsId))
				.firstOrFail();

			await network.delete();
			await address.delete();
			await paymentDetails.delete();
		});
	}
}
