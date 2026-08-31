import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import { NetworkFactory } from "#database/factories/network.factory";

test.group("Features / Admin / Networks / Controllers / View Controller", () => {
	test("it should return a network with its relations and exact action metadata", async ({
		client,
		assert,
	}) => {
		const admin = await AdminFactory.create();
		const network = await NetworkFactory.with("address").with("paymentDetails").create();

		const response = await client
			.visit("admin.networks.view", { networkId: network.id })
			.withGuard("admin")
			.loginAs(admin);

		response.assertOk();
		const body = response.body();
		assert.equal(body.id, network.id);
		assert.equal(body.addressId, network.addressId);
		assert.equal(body.address.id, network.addressId);
		assert.equal(body.paymentDetailsId, network.paymentDetailsId);
		assert.equal(body.paymentDetails.id, network.paymentDetailsId);
		assert.property(body, "createdAt");
		assert.property(body, "updatedAt");
		assert.deepEqual(Object.keys(body.meta).sort(), ["canDelete", "canUpdate"]);
		assert.deepEqual(body.meta, {
			canUpdate: true,
			canDelete: true,
		});
	});

	test("it should return not found for an unknown networkId", async ({ client }) => {
		const admin = await AdminFactory.create();

		const response = await client
			.visit("admin.networks.view", { networkId: 999_999 })
			.withGuard("admin")
			.loginAs(admin);

		response.assertNotFound();
	});

	test("it should reject unauthenticated requests", async ({ client }) => {
		const response = await client.visit("admin.networks.view", { networkId: 1 });

		response.assertUnauthorized();
		response.assertBodyContains({
			code: "E_UNAUTHENTICATED",
		});
	});
});
