import { test } from "@japa/runner";

import { FirmFactory } from "#database/factories/firm.factory";
import { NetworkFactory } from "#database/factories/network.factory";
import DeleteFirmService from "#features/admin/firms/services/delete.service";
import Address from "#models/address";
import CommissionRate from "#models/commission_rate";
import Firm from "#models/firm";
import PaymentDetail from "#models/payment_detail";

test.group("Features / Admin / Firms / Services / Delete Service", () => {
	test("it should rollback the firm deletion when owned child deletion fails", async ({
		assert,
	}) => {
		const firm = await FirmFactory.merge({ name: "Rollback Delete Firm" })
			.with("address")
			.with("paymentDetail")
			.with("commissionRate")
			.create();
		await NetworkFactory.merge({
			name: "Rollback Firm Address Reference",
			amundiOrgId: "ROLLBACK-FIRM-ADDRESS",
			addressId: firm.addressId,
		})
			.with("paymentDetail")
			.with("commissionRate")
			.create();

		await assert.rejects(() => new DeleteFirmService().handle(firm.id));

		assert.isNotNull(await Firm.find(firm.id));
		assert.isNotNull(await Address.find(firm.addressId));
		assert.isNotNull(await PaymentDetail.find(firm.paymentDetailId));
		assert.isNotNull(await CommissionRate.find(firm.commissionRateId));
	});

	test("it should rollback all deletions when the commission rate is still referenced", async ({
		assert,
	}) => {
		const firm = await FirmFactory.with("address")
			.with("paymentDetail")
			.with("commissionRate")
			.create();
		const network = await NetworkFactory.merge({ commissionRateId: firm.commissionRateId })
			.with("address")
			.with("paymentDetail")
			.create();

		await assert.rejects(() => new DeleteFirmService().handle(firm.id));

		assert.isNotNull(await Firm.find(firm.id));
		assert.isNotNull(await Address.find(firm.addressId));
		assert.isNotNull(await PaymentDetail.find(firm.paymentDetailId));
		assert.isNotNull(await CommissionRate.find(firm.commissionRateId));
		assert.isNotNull(await network.refresh());
	});
});
