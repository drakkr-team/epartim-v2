import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import { FirmFactory } from "#database/factories/firm.factory";
import { NetworkFactory } from "#database/factories/network.factory";
import Address from "#models/address";
import CommissionRate from "#models/commission_rate";
import Firm from "#models/firm";
import Network from "#models/network";
import PaymentDetail from "#models/payment_detail";
import Role from "#models/role";

const commissionRate = {
	shortTermRatePercent: 12.5,
	mediumTermRatePercent: 25,
	longTermRatePercent: 37.5,
};

test.group("Features / Admin / Networks / Controllers / Delete Controller", () => {
	test("it should physically delete an unused network and its owned records", async ({
		client,
		assert,
	}) => {
		const admin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["delete:network"];
		await role.save();
		const network = await NetworkFactory.with("address")
			.with("paymentDetail")
			.with("commissionRate", 1, (rate) => rate.merge(commissionRate))
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
		assert.isNull(await CommissionRate.find(network.commissionRateId));
	});

	test("it should delete a referenced network and clear the firm relation", async ({
		client,
		assert,
	}) => {
		const admin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["delete:network"];
		await role.save();
		const network = await NetworkFactory.with("address")
			.with("paymentDetail")
			.with("commissionRate", 1, (rate) => rate.merge(commissionRate))
			.create();
		const firm = await FirmFactory.merge({ networkId: network.id })
			.with("address")
			.with("paymentDetail")
			.with("commissionRate", 1, (rate) => rate.merge(commissionRate))
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
		assert.isNull(await CommissionRate.find(network.commissionRateId));
		assert.isNull((await Firm.findOrFail(firm.id)).networkId);
		assert.isNotNull(await CommissionRate.find(firm.commissionRateId));
	});

	test("it should roll back deletion when a firm shares the owned commission rate", async ({
		client,
		assert,
	}) => {
		const admin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["delete:network"];
		await role.save();
		const network = await NetworkFactory.with("address")
			.with("paymentDetail")
			.with("commissionRate", 1, (rate) => rate.merge(commissionRate))
			.create();
		const firm = await FirmFactory.merge({
			networkId: network.id,
			commissionRateId: network.commissionRateId,
		})
			.with("address")
			.with("paymentDetail")
			.create();

		const response = await client
			.visit("admin.networks.delete", { networkId: network.id })
			.withGuard("admin")
			.loginAs(admin);

		response.assertStatus(500);
		assert.isNotNull(await Network.find(network.id));
		assert.isNotNull(await Address.find(network.addressId));
		assert.isNotNull(await PaymentDetail.find(network.paymentDetailId));
		assert.isNotNull(await CommissionRate.find(network.commissionRateId));
		const persistedFirm = await Firm.findOrFail(firm.id);
		assert.equal(persistedFirm.networkId, network.id);
		assert.equal(persistedFirm.commissionRateId, network.commissionRateId);
	});

	test("it should return not found for an unknown networkId", async ({ client }) => {
		const admin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["delete:network"];
		await role.save();

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
