import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import { NetworkFactory } from "#database/factories/network.factory";
import Address from "#models/address";
import CommissionRate from "#models/commission_rate";
import Network from "#models/network";
import PaymentDetail from "#models/payment_detail";
import Role from "#models/role";

const originalCommissionRate = {
	shortTermRatePercent: 12.5,
	mediumTermRatePercent: 25,
	longTermRatePercent: 37.5,
};

async function createUpdateFixture(name: string, amundiOrgId: string) {
	const network = await NetworkFactory.merge({ name, amundiOrgId, goCode: "112000" })
		.with("address")
		.with("paymentDetail")
		.with("commissionRate", 1, (rate) => rate.merge(originalCommissionRate))
		.create();
	await Address.query().where("id", String(network.addressId)).update({
		lineOne: "10 Original Street",
		lineTwo: "Original floor",
		zip: "75001",
		city: "Paris",
	});
	await PaymentDetail.query().where("id", String(network.paymentDetailId)).update({
		iban: "FR7630006000011234567890189",
		bic: "AGRIFRPP",
	});
	return network;
}

test.group("Features / Admin / Networks / Controllers / Update Controller", () => {
	test("it should partially update network and owned fields without replacing relations", async ({
		client,
		assert,
	}) => {
		const admin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["update:network"];
		await role.save();
		const network = await createUpdateFixture("Original Network", "AMUNDI-ORIGINAL");

		const response = await client
			.visit("admin.networks.update", { networkId: network.id })
			.withGuard("admin")
			.loginAs(admin)
			.json({
				name: "Updated Network",
				address: {
					lineOne: "10 Original Street",
					lineTwo: "Original floor",
					zip: "75001",
					city: "Lyon",
					coordinates: { latitude: 45.764, longitude: 4.8357 },
				},
				paymentDetail: {
					iban: "fr76 3000 6000 0112 3456 7890 189",
					bic: "agri fr pp",
				},
			});

		response.assertOk();
		response.assertBodyContains({
			id: network.id,
			name: "Updated Network",
			amundiOrgId: "AMUNDI-ORIGINAL",
			addressId: network.addressId,
			paymentDetailId: network.paymentDetailId,
		});
		assert.equal(String(response.body().goCode), "112000");

		const persisted = await Network.query()
			.where("id", String(network.id))
			.preload("address")
			.preload("paymentDetail")
			.preload("commissionRate")
			.firstOrFail();
		assert.equal(persisted.address.id, network.addressId);
		assert.equal(persisted.address.city, "Lyon");
		assert.equal(persisted.paymentDetail.id, network.paymentDetailId);
		assert.equal(persisted.paymentDetail.iban, "FR76 3000 6000 0112 3456 7890 189");
		assert.equal(persisted.paymentDetail.bic, "AGRI FR PP");
		assert.equal(persisted.commissionRateId, network.commissionRateId);
		assert.equal(
			persisted.commissionRate.shortTermRatePercent,
			originalCommissionRate.shortTermRatePercent,
		);
		assert.equal(
			persisted.commissionRate.mediumTermRatePercent,
			originalCommissionRate.mediumTermRatePercent,
		);
		assert.equal(
			persisted.commissionRate.longTermRatePercent,
			originalCommissionRate.longTermRatePercent,
		);
	});

	test("it should update all commission rates without replacing the relation", async ({
		client,
		assert,
	}) => {
		const admin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["update:network"];
		await role.save();
		const network = await createUpdateFixture("Rate Update Target", "AMUNDI-RATE-UPDATE");
		const commissionRate = {
			shortTermRatePercent: 0,
			mediumTermRatePercent: 62.5,
			longTermRatePercent: 100,
		};

		const response = await client
			.visit("admin.networks.update", { networkId: network.id })
			.withGuard("admin")
			.loginAs(admin)
			.json({ commissionRate });

		response.assertOk();
		const persisted = await Network.findOrFail(network.id);
		assert.equal(persisted.commissionRateId, network.commissionRateId);
		const rate = await CommissionRate.findOrFail(persisted.commissionRateId);
		assert.equal(rate.shortTermRatePercent, commissionRate.shortTermRatePercent);
		assert.equal(rate.mediumTermRatePercent, commissionRate.mediumTermRatePercent);
		assert.equal(rate.longTermRatePercent, commissionRate.longTermRatePercent);
	});

	test("it should require all nested fields when commission rates are supplied", async ({
		client,
	}) => {
		const admin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["update:network"];
		await role.save();
		const network = await createUpdateFixture("Incomplete Rates", "AMUNDI-INCOMPLETE");
		const invalidRates = [
			{ commissionRate: {}, field: "commissionRate.shortTermRatePercent" },
			...Object.keys(originalCommissionRate).map((field) => ({
				commissionRate: { ...originalCommissionRate, [field]: undefined },
				field: `commissionRate.${field}`,
			})),
		];

		for (const { commissionRate, field } of invalidRates) {
			const response = await client
				.visit("admin.networks.update", { networkId: network.id })
				.withGuard("admin")
				.loginAs(admin)
				.unsafeJson({ commissionRate });

			response.assertStatus(422);
			response.assertBodyContains({ errors: [{ field, rule: "required" }] });
		}
	});

	test("it should reject invalid commission rates without changing stored rates", async ({
		client,
		assert,
	}) => {
		const admin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["update:network"];
		await role.save();
		const network = await createUpdateFixture("Invalid Rates", "AMUNDI-INVALID-RATES");

		for (const field of Object.keys(originalCommissionRate)) {
			for (const value of [-0.5, 100.5, "invalid", null]) {
				const response = await client
					.visit("admin.networks.update", { networkId: network.id })
					.withGuard("admin")
					.loginAs(admin)
					.unsafeJson({
						commissionRate: { ...originalCommissionRate, [field]: value },
					});

				response.assertStatus(422);
				response.assertBodyContains({ errors: [{ field: `commissionRate.${field}` }] });
			}
		}
		const rate = await CommissionRate.findOrFail(network.commissionRateId);
		assert.equal(rate.shortTermRatePercent, originalCommissionRate.shortTermRatePercent);
		assert.equal(rate.mediumTermRatePercent, originalCommissionRate.mediumTermRatePercent);
		assert.equal(rate.longTermRatePercent, originalCommissionRate.longTermRatePercent);
	});

	test("it should preserve commission rates when the optional object is null", async ({
		client,
		assert,
	}) => {
		const admin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["update:network"];
		await role.save();
		const network = await createUpdateFixture("Null Rate Target", "AMUNDI-NULL-RATE");

		const response = await client
			.visit("admin.networks.update", { networkId: network.id })
			.withGuard("admin")
			.loginAs(admin)
			.unsafeJson({ commissionRate: null });

		response.assertOk();
		const persisted = await Network.findOrFail(network.id);
		assert.equal(persisted.commissionRateId, network.commissionRateId);
		const rate = await CommissionRate.findOrFail(persisted.commissionRateId);
		assert.equal(rate.shortTermRatePercent, originalCommissionRate.shortTermRatePercent);
		assert.equal(rate.mediumTermRatePercent, originalCommissionRate.mediumTermRatePercent);
		assert.equal(rate.longTermRatePercent, originalCommissionRate.longTermRatePercent);
	});

	test("it should ignore read-only identifiers supplied during update", async ({ client }) => {
		const admin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["update:network"];
		await role.save();
		const network = await createUpdateFixture("Same Unique Network", "AMUNDI-SAME");

		const response = await client
			.visit("admin.networks.update", { networkId: network.id })
			.withGuard("admin")
			.loginAs(admin)
			.unsafeJson({
				amundiOrgId: null,
				goCode: null,
			});

		response.assertOk();
		response.assertBodyContains({
			name: network.name,
			amundiOrgId: network.amundiOrgId,
			goCode: network.goCode,
		});
	});

	test("it should reject duplicate network names", async ({ client }) => {
		const admin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["update:network"];
		await role.save();
		const target = await createUpdateFixture("Target Network", "AMUNDI-TARGET");
		const existing = await createUpdateFixture("Existing Network", "AMUNDI-EXISTING");

		const response = await client
			.visit("admin.networks.update", { networkId: target.id })
			.withGuard("admin")
			.loginAs(admin)
			.json({ name: existing.name });

		response.assertStatus(422);
	});

	test("it should allow a no-op payload", async ({ client, assert }) => {
		const admin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["update:network"];
		await role.save();
		const network = await createUpdateFixture("Empty Payload Target", "AMUNDI-EMPTY");

		const response = await client
			.visit("admin.networks.update", { networkId: network.id })
			.withGuard("admin")
			.loginAs(admin)
			.json({});

		response.assertOk();
		assert.equal(response.body().addressId, network.addressId);
		assert.equal(response.body().paymentDetailId, network.paymentDetailId);
	});

	test("it should reject invalid partial values", async ({ client }) => {
		const admin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["update:network"];
		await role.save();
		const network = await createUpdateFixture("Validation Target", "AMUNDI-VALIDATION");
		const invalidPayloads = [
			{
				address: {
					lineOne: "10 Validation Street",
					zip: "75001",
					city: "Paris",
					coordinates: { latitude: 91, longitude: 0 },
				},
			},
			{
				paymentDetail: {
					iban: "FR001234",
					bic: "AGRIFRPP",
				},
			},
			{
				paymentDetail: {
					iban: "FR7630006000011234567890189",
					bic: "INVALID",
				},
			},
		];

		for (const payload of invalidPayloads) {
			const response = await client
				.visit("admin.networks.update", { networkId: network.id })
				.withGuard("admin")
				.loginAs(admin)
				.json(payload);

			response.assertStatus(422);
		}
	});

	test("it should return not found for an unknown networkId", async ({ client }) => {
		const admin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["update:network"];
		await role.save();

		const response = await client
			.visit("admin.networks.update", { networkId: 999_999 })
			.withGuard("admin")
			.loginAs(admin)
			.json({ name: "Missing Network" });

		response.assertNotFound();
	});

	test("it should reject unauthenticated requests", async ({ client }) => {
		const response = await client
			.visit("admin.networks.update", { networkId: 1 })
			.json({ name: "Unauthorized Update" });

		response.assertUnauthorized();
		response.assertBodyContains({
			code: "E_UNAUTHENTICATED",
		});
	});
});
