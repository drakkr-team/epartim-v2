import Network from "#models/network";

export default class ViewNetworkService {
	handle(networkId: string | number | bigint) {
		return Network.query()
			.where("id", String(networkId))
			.preload("address")
			.preload("paymentDetails")
			.firstOrFail();
	}
}
