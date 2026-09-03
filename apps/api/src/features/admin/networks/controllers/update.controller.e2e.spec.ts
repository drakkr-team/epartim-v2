import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import { NetworkFactory } from "#database/factories/network.factory";
import Address from "#models/address";
import Network from "#models/network";
import PaymentDetail from "#models/payment_detail";

async function createUpdateFixture(name: string, amundiOrgId: string) {
	const network = await NetworkFactory.merge({ name, amundiOrgId, goCode: "112000" })
		.with("address")
		.with("paymentDetail")
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
		const admin = await AdminFactory.create();
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
			.firstOrFail();
		assert.equal(persisted.address.id, network.addressId);
		assert.equal(persisted.address.city, "Lyon");
		assert.equal(persisted.paymentDetail.id, network.paymentDetailId);
		assert.equal(persisted.paymentDetail.iban, "FR76 3000 6000 0112 3456 7890 189");
		assert.equal(persisted.paymentDetail.bic, "AGRI FR PP");
	});

	test("it should ignore read-only identifiers supplied during update", async ({ client }) => {
		const admin = await AdminFactory.create();
		const network = await createUpdateFixture("Same Unique Network", "AMUNDI-SAME");

		const response = await client
			.put(`/admin/networks/${network.id}`)
			.withGuard("admin")
			.loginAs(admin)
			.json({
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
		const admin = await AdminFactory.create();
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
		const admin = await AdminFactory.create();
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
		const admin = await AdminFactory.create();
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
		const admin = await AdminFactory.create();

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
