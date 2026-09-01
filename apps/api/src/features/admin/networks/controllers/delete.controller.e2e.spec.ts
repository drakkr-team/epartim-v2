import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import { FirmFactory } from "#database/factories/firm.factory";
import { NetworkFactory } from "#database/factories/network.factory";
import Address from "#models/address";
import Firm from "#models/firm";
import Network from "#models/network";
import PaymentDetail from "#models/payment_detail";

test.group("Features / Admin / Networks / Controllers / Delete Controller", () => {
	test("it should physically delete an unused network and its owned records", async ({
		client,
		assert,
	}) => {
		const admin = await AdminFactory.create();
		const network = await NetworkFactory.with("address").with("paymentDetails").create();

		const response = await client
			.visit("admin.networks.delete", { networkId: network.id })
			.withGuard("admin")
			.loginAs(admin);

		response.assertNoContent();
		assert.equal(response.text(), "");
		assert.isNull(await Network.find(network.id));
		assert.isNull(await Address.find(network.addressId));
		assert.isNull(await PaymentDetail.find(network.paymentDetailId));
	});

	test("it should delete a referenced network and clear the firm relation", async ({
		client,
		assert,
	}) => {
		const admin = await AdminFactory.create();
		const network = await NetworkFactory.with("address").with("paymentDetails").create();
		const firm = await FirmFactory.merge({ networkId: network.id })
			.with("address")
			.with("paymentDetails")
			.create();

		const response = await client
			.visit("admin.networks.delete", { networkId: network.id })
			.withGuard("admin")
			.loginAs(admin);

		response.assertNoContent();
		assert.equal(response.text(), "");
		assert.isNull(await Network.find(network.id));
		assert.isNull(await Address.find(network.addressId));
		assert.isNull(await PaymentDetail.find(network.paymentDetailId));
		assert.isNull((await Firm.findOrFail(firm.id)).networkId);
	});

	test("it should return not found for an unknown networkId", async ({ client }) => {
		const admin = await AdminFactory.create();

		const response = await client
			.visit("admin.networks.delete", { networkId: 999_999 })
			.withGuard("admin")
			.loginAs(admin);

		response.assertNotFound();
	});

	test("it should reject unauthenticated requests", async ({ client }) => {
		const response = await client.visit("admin.networks.delete", { networkId: 1 });

		response.assertUnauthorized();
		response.assertBodyContains({
			code: "E_UNAUTHENTICATED",
		});
	});
});
