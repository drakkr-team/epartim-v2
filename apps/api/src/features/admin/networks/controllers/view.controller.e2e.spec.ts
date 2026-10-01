import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import { NetworkFactory } from "#database/factories/network.factory";
import Role from "#models/role";

test.group("Features / Admin / Networks / Controllers / View Controller", () => {
	test("it should return a network with relation identifiers and action metadata", async ({
		client,
		assert,
	}) => {
		const admin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["update:network", "delete:network"];
		await role.save();
		const network = await NetworkFactory.with("address")
			.with("paymentDetail")
			.with("commissionRate", 1, (rate) =>
				rate.merge({
					shortTermRatePercent: 12.5,
					mediumTermRatePercent: 25,
					longTermRatePercent: 37.5,
				}),
			)
			.create();

		const response = await client
			.visit("admin.networks.view", { networkId: network.id })
			.withGuard("admin")
			.loginAs(admin);

		response.assertOk();
		const body = response.body();
		assert.equal(body.id, network.id);
		assert.equal(body.addressId, network.addressId);
		assert.equal(body.paymentDetailId, network.paymentDetailId);
		assert.equal(body.address.id, network.addressId);
		assert.equal(body.paymentDetail.id, network.paymentDetailId);
		assert.equal(body.commissionRate.id, network.commissionRateId);
		assert.equal(body.commissionRate.shortTermRatePercent, 12.5);
		assert.equal(body.commissionRate.mediumTermRatePercent, 25);
		assert.equal(body.commissionRate.longTermRatePercent, 37.5);
		assert.property(body.commissionRate, "createdAt");
		assert.property(body.commissionRate, "updatedAt");
		assert.notProperty(body, "paymentDetails");
		assert.property(body, "createdAt");
		assert.property(body, "updatedAt");
		assert.deepEqual(Object.keys(body.meta).sort(), ["canDelete", "canUpdate"]);
		assert.deepEqual(body.meta, {
			canUpdate: true,
			canDelete: true,
		});
	});

	test("it should return not found for an unknown networkId", async ({ client }) => {
		const admin = await AdminFactory.with("role").create();

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
