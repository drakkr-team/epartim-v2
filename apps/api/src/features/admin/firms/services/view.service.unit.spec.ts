import { test } from "@japa/runner";

import { FirmFactory } from "#database/factories/firm.factory";
import { NetworkFactory } from "#database/factories/network.factory";
import ViewFirmService from "#features/admin/firms/services/view.service";

test.group("Features / Admin / Firms / Services / View Service", () => {
	test("it should preload only the owned relations", async ({ assert }) => {
		const network = await NetworkFactory.with("address").with("paymentDetails").create();
		const created = await FirmFactory.merge({ networkId: network.id })
			.with("address")
			.with("paymentDetails")
			.create();

		const firm = await new ViewFirmService().handle(created.id);

		assert.equal(firm.address.id, created.addressId);
		assert.equal(firm.paymentDetails.id, created.paymentDetailsId);
		assert.isUndefined(firm.network);
	});
});
