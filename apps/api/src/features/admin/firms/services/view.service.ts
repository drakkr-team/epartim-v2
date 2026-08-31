import Firm from "#models/firm";

export default class ViewFirmService {
	handle(firmId: bigint | number | string) {
		return Firm.query()
			.where("id", Number(firmId))
			.preload("address")
			.preload("paymentDetails")
			.firstOrFail();
	}
}
