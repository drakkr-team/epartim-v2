import { test } from "@japa/runner";

import { FirmFactory } from "#database/factories/firm.factory";
import UpdateFirmService from "#features/admin/firms/services/update.service";
import Address from "#models/address";
import Firm from "#models/firm";

test.group("Features / Admin / Firms / Services / Update Service", () => {
	test("it should rollback owned relation updates when the firm update fails", async ({
		assert,
	}) => {
		const existing = await FirmFactory.merge({ name: "Existing Transaction Firm" })
			.with("address")
			.with("paymentDetails")
			.create();
		const target = await FirmFactory.merge({ name: "Target Transaction Firm" })
			.with("address")
			.with("paymentDetails")
			.create();
		await Address.query().where("id", Number(target.addressId)).update({ city: "Paris" });

		await assert.rejects(() =>
			new UpdateFirmService().handle(target.id, {
				name: existing.name,
				address: { city: "Lyon" },
			}),
		);

		const persistedFirm = await Firm.findOrFail(target.id);
		const persistedAddress = await Address.findOrFail(target.addressId);
		assert.equal(persistedFirm.name, "Target Transaction Firm");
		assert.equal(persistedAddress.city, "Paris");
	});
});
