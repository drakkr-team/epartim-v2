import { test } from "@japa/runner";

import { FirmFactory } from "#database/factories/firm.factory";
import { NetworkFactory } from "#database/factories/network.factory";
import DeleteFirmService from "#features/admin/firms/services/delete.service";
import Address from "#models/address";
import Firm from "#models/firm";
import PaymentDetail from "#models/payment_detail";

test.group("Features / Admin / Firms / Services / Delete Service", () => {
	test("it should rollback the firm deletion when owned child deletion fails", async ({
		assert,
	}) => {
		const firm = await FirmFactory.merge({ name: "Rollback Delete Firm" })
			.with("address")
			.with("paymentDetails")
			.create();
		await NetworkFactory.merge({
			name: "Rollback Firm Address Reference",
			amundiOrgId: "ROLLBACK-FIRM-ADDRESS",
			addressId: firm.addressId,
		})
			.with("paymentDetails")
			.create();

		await assert.rejects(() => new DeleteFirmService().handle(firm.id));

		assert.isNotNull(await Firm.find(firm.id));
		assert.isNotNull(await Address.find(firm.addressId));
		assert.isNotNull(await PaymentDetail.find(firm.paymentDetailsId));
	});
});
