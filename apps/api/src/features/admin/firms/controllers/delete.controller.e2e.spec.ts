import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import { FirmFactory } from "#database/factories/firm.factory";
import Address from "#models/address";
import Firm from "#models/firm";
import PaymentDetail from "#models/payment_detail";
import Role from "#models/role";

test.group("Features / Admin / Firms / Controllers / Delete Controller", () => {
	test("it should physically delete a firm and its owned records", async ({ client, assert }) => {
		const admin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["delete:firm"];
		await role.save();
		const firm = await FirmFactory.with("address").with("paymentDetail").create();

		const response = await client
			.visit("admin.firms.delete", { firmId: firm.id })
			.withGuard("admin")
			.loginAs(admin);

		response.assertNoContent();
		assert.equal(response.text(), "");
		assert.isNull(await Firm.find(firm.id));
		assert.isNull(await Address.find(firm.addressId));
		assert.isNull(await PaymentDetail.find(firm.paymentDetailId));
	});

	test("it should return not found for an unknown firmId", async ({ client }) => {
		const admin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["delete:firm"];
		await role.save();

		const response = await client
			.visit("admin.firms.delete", { firmId: 999_999_999 })
			.withGuard("admin")
			.loginAs(admin);

		response.assertNotFound();
	});

	test("it should reject unauthenticated requests", async ({ client }) => {
		const response = await client.visit("admin.firms.delete", { firmId: 1 });

		response.assertUnauthorized();
		response.assertBodyContains({
			code: "E_UNAUTHENTICATED",
		});
	});
});
