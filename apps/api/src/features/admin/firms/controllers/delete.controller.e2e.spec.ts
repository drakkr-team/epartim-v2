import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import { FirmFactory } from "#database/factories/firm.factory";
import Address from "#models/address";
import Firm from "#models/firm";
import PaymentDetail from "#models/payment_detail";

test.group("Features / Admin / Firms / Controllers / Delete Controller", () => {
	test("it should physically delete a firm and its owned records", async ({ client, assert }) => {
		const admin = await AdminFactory.create();
		const firm = await FirmFactory.with("address").with("paymentDetails").create();

		const response = await client
			.delete(`/admin/firms/${firm.id}`)
			.withGuard("admin")
			.loginAs(admin);

		response.assertNoContent();
		assert.equal(response.text(), "");
		assert.isNull(await Firm.find(firm.id));
		assert.isNull(await Address.find(firm.addressId));
		assert.isNull(await PaymentDetail.find(firm.paymentDetailsId));
	});

	test("it should return not found for an unknown firmId", async ({ client }) => {
		const admin = await AdminFactory.create();

		const response = await client
			.delete("/admin/firms/999999999")
			.withGuard("admin")
			.loginAs(admin);

		response.assertNotFound();
	});

	test("it should reject unauthenticated requests", async ({ client }) => {
		const response = await client.delete("/admin/firms/1");

		response.assertUnauthorized();
		response.assertBodyContains({
			code: "E_UNAUTHENTICATED",
		});
	});
});
