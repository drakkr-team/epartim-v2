import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import { FirmFactory } from "#database/factories/firm.factory";
import { NetworkFactory } from "#database/factories/network.factory";

test.group("Features / Admin / Firms / Controllers / View Controller", () => {
	test("it should return a firm with owned relations and action metadata", async ({
		client,
		assert,
	}) => {
		const admin = await AdminFactory.create();
		const network = await NetworkFactory.with("address").with("paymentDetail").create();
		const firm = await FirmFactory.merge({
			name: "Viewed Firm",
			networkId: network.id,
		})
			.with("address")
			.with("paymentDetail")
			.create();

		const response = await client.get(`/admin/firms/${firm.id}`).withGuard("admin").loginAs(admin);

		response.assertOk();
		const body = response.body();
		assert.equal(body.id, firm.id);
		assert.equal(body.networkId, network.id);
		assert.equal(body.addressId, firm.addressId);
		assert.equal(body.paymentDetailId, firm.paymentDetailId);
		assert.equal(body.address.id, firm.addressId);
		assert.equal(body.paymentDetail.id, firm.paymentDetailId);
		assert.equal(body.network.id, network.id);
		assert.equal(body.network.name, network.name);
		assert.deepEqual(body.meta, {
			canUpdate: true,
			canDelete: true,
		});
	});

	test("it should return null when the firm has no network", async ({ client, assert }) => {
		const admin = await AdminFactory.create();
		const firm = await FirmFactory.merge({ networkId: null })
			.with("address")
			.with("paymentDetail")
			.create();

		const response = await client.get(`/admin/firms/${firm.id}`).withGuard("admin").loginAs(admin);

		response.assertOk();
		assert.isNull(response.body().network);
	});

	test("it should return not found for an unknown firmId", async ({ client }) => {
		const admin = await AdminFactory.create();

		const response = await client.get("/admin/firms/999999999").withGuard("admin").loginAs(admin);

		response.assertNotFound();
	});

	test("it should reject unauthenticated requests", async ({ client }) => {
		const response = await client.get("/admin/firms/1");

		response.assertUnauthorized();
		response.assertBodyContains({
			code: "E_UNAUTHENTICATED",
		});
	});
});
