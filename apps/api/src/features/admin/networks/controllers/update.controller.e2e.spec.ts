import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import { NetworkFactory } from "#database/factories/network.factory";
import Address from "#models/address";
import Network from "#models/network";
import PaymentDetail from "#models/payment_detail";

async function createUpdateFixture(name: string, amundiOrgId: string) {
	const network = await NetworkFactory.merge({ name, amundiOrgId, goCode: 112_000 })
		.with("address")
		.with("paymentDetails")
		.create();
	await Address.query().where("id", String(network.addressId)).update({
		lineOne: "10 Original Street",
		lineTwo: "Original floor",
		zip: "75001",
		city: "Paris",
	});
	await PaymentDetail.query().where("id", String(network.paymentDetailsId)).update({
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
				address: { city: "Lyon" },
				paymentDetails: { iban: "fr76 3000 6000 0112 3456 7890 189" },
			});

		response.assertOk();
		response.assertBodyContains({
			id: network.id,
			name: "Updated Network",
			amundiOrgId: "AMUNDI-ORIGINAL",
			addressId: network.addressId,
			paymentDetailsId: network.paymentDetailsId,
			address: {
				lineOne: "10 Original Street",
				lineTwo: "Original floor",
				zip: "75001",
				city: "Lyon",
			},
			paymentDetails: {
				iban: "FR7630006000011234567890189",
				bic: "AGRIFRPP",
			},
		});
		assert.equal(String(response.body().goCode), "112000");

		const persisted = await Network.query()
			.where("id", String(network.id))
			.preload("address")
			.preload("paymentDetails")
			.firstOrFail();
		assert.equal(persisted.address.id, network.addressId);
		assert.equal(persisted.paymentDetails.id, network.paymentDetailsId);
	});

	test("it should distinguish explicit nulls and allow unchanged unique values", async ({
		client,
	}) => {
		const admin = await AdminFactory.create();
		const network = await createUpdateFixture("Same Unique Network", "AMUNDI-SAME");

		const response = await client
			.visit("admin.networks.update", { networkId: network.id })
			.withGuard("admin")
			.loginAs(admin)
			.json({
				name: network.name,
				amundiOrgId: null,
				goCode: null,
			});

		response.assertOk();
		response.assertBodyContains({
			name: network.name,
			amundiOrgId: null,
			goCode: null,
		});
	});

	test("it should reject duplicate network names and Amundi organization IDs", async ({
		client,
	}) => {
		const admin = await AdminFactory.create();
		const target = await createUpdateFixture("Target Network", "AMUNDI-TARGET");
		const existing = await createUpdateFixture("Existing Network", "AMUNDI-EXISTING");

		for (const payload of [{ name: existing.name }, { amundiOrgId: existing.amundiOrgId }]) {
			const response = await client
				.visit("admin.networks.update", { networkId: target.id })
				.withGuard("admin")
				.loginAs(admin)
				.json(payload);

			response.assertStatus(422);
		}
	});

	test("it should reject payloads without modifiable fields", async ({ client }) => {
		const admin = await AdminFactory.create();
		const network = await createUpdateFixture("Empty Payload Target", "AMUNDI-EMPTY");

		for (const payload of [{}, { address: {} }, { paymentDetails: {} }, { addressId: 999 }]) {
			const response = await client
				.visit("admin.networks.update", { networkId: network.id })
				.withGuard("admin")
				.loginAs(admin)
				.json(payload);

			response.assertStatus(422);
		}
	});

	test("it should reject invalid partial values", async ({ client }) => {
		const admin = await AdminFactory.create();
		const network = await createUpdateFixture("Validation Target", "AMUNDI-VALIDATION");
		const invalidPayloads = [
			{ name: "" },
			{ goCode: 1.5 },
			{ address: { coordinates: { latitude: 91, longitude: 0 } } },
			{ paymentDetails: { iban: "FR001234" } },
			{ paymentDetails: { bic: "INVALID" } },
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
