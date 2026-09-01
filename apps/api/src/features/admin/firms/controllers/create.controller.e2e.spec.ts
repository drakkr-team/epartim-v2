import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import { FirmFactory } from "#database/factories/firm.factory";
import { NetworkFactory } from "#database/factories/network.factory";
import Firm from "#models/firm";

const validPayload = {
	name: "Cabinet Martin",
	amundiOrgId: "AMU-001",
	orias: "12345678",
	address: {
		lineOne: "10 rue de Paris",
		lineTwo: "Bâtiment A",
		zip: "75001",
		city: "Paris",
		coordinates: {
			latitude: 48.8566,
			longitude: 2.3522,
		},
	},
	paymentDetail: {
		iban: "fr76 3000 6000 0112 3456 7890 189",
		bic: "agri fr pp",
	},
};

test.group("Features / Admin / Firms / Controllers / Create Controller", () => {
	test("it should create owned records and return the presented firm", async ({
		client,
		assert,
	}) => {
		const admin = await AdminFactory.create();

		const response = await client
			.visit("admin.firms.create")
			.withGuard("admin")
			.loginAs(admin)
			.json(validPayload);

		response.assertCreated();
		response.assertBodyContains({
			name: validPayload.name,
			amundiOrgId: validPayload.amundiOrgId,
			orias: validPayload.orias,
		});
		assert.property(response.body(), "addressId");
		assert.property(response.body(), "paymentDetailId");
		assert.notProperty(response.body(), "meta");

		const firm = await Firm.query()
			.where("name", validPayload.name)
			.preload("address")
			.preload("paymentDetail")
			.firstOrFail();
		assert.equal(firm.address.id, response.body().addressId);
		assert.equal(firm.paymentDetail.id, response.body().paymentDetailId);
	});

	test("it should attach an existing network", async ({ client }) => {
		const admin = await AdminFactory.create();
		const network = await NetworkFactory.with("address").with("paymentDetail").create();

		const response = await client
			.visit("admin.firms.create")
			.withGuard("admin")
			.loginAs(admin)
			.json({
				...validPayload,
				name: "Cabinet Réseau",
				amundiOrgId: "AMU-002",
				orias: "12345679",
				networkId: Number(network.id),
			});

		response.assertCreated();
		response.assertBodyContains({ networkId: Number(network.id) });
	});

	test("it should accept optional nullable fields and omitted coordinates", async ({
		client,
		assert,
	}) => {
		const admin = await AdminFactory.create();
		const { coordinates: _, ...address } = validPayload.address;

		for (const [name, orias] of [
			["Cabinet Nullable A", "12345680"],
			["Cabinet Nullable B", "12345681"],
		] as const) {
			const response = await client
				.visit("admin.firms.create")
				.withGuard("admin")
				.loginAs(admin)
				.json({
					...validPayload,
					name,
					orias,
					amundiOrgId: null,
					address,
				});

			response.assertCreated();
			response.assertBodyContains({ amundiOrgId: null });

			const firm = await Firm.query().where("name", name).preload("address").firstOrFail();
			assert.isNull(firm.networkId);
			assert.isNull(firm.address.coordinates);
		}
	});

	test("it should reject missing owned fields and malformed values", async ({ client }) => {
		const admin = await AdminFactory.create();
		const createFirmPath: string = "/admin/firms";
		const invalidPayloads = [
			{ ...validPayload, name: "", orias: "12345682" },
			{ ...validPayload, name: "Missing address", orias: "12345683", address: undefined },
			{
				...validPayload,
				name: "Invalid latitude",
				orias: "12345684",
				address: {
					...validPayload.address,
					coordinates: { latitude: 91, longitude: 2 },
				},
			},
			{
				...validPayload,
				name: "Invalid longitude",
				orias: "12345685",
				address: {
					...validPayload.address,
					coordinates: { latitude: 48, longitude: -181 },
				},
			},
			{
				...validPayload,
				name: "Invalid IBAN",
				orias: "12345686",
				paymentDetail: { ...validPayload.paymentDetail, iban: "FR001234" },
			},
			{
				...validPayload,
				name: "Invalid BIC",
				orias: "12345687",
				paymentDetail: { ...validPayload.paymentDetail, bic: "INVALID" },
			},
		];

		for (const payload of invalidPayloads) {
			const response = await client
				.post(createFirmPath)
				.withGuard("admin")
				.loginAs(admin)
				.json(payload);

			response.assertStatus(422);
		}
	});

	test("it should reject duplicate firm identifiers and an unknown network", async ({ client }) => {
		const admin = await AdminFactory.create();
		const existing = await FirmFactory.merge({
			name: "Existing Cabinet",
			amundiOrgId: "AMU-EXISTING",
			orias: "12345688",
		})
			.with("address")
			.with("paymentDetail")
			.create();
		const invalidPayloads = [
			{ ...validPayload, name: existing.name, orias: "12345689" },
			{
				...validPayload,
				name: "Duplicate Amundi",
				amundiOrgId: existing.amundiOrgId,
				orias: "12345690",
			},
			{ ...validPayload, name: "Duplicate ORIAS", orias: existing.orias },
			{
				...validPayload,
				name: "Unknown Network",
				orias: "12345691",
				networkId: 999_999_999,
			},
		];

		for (const payload of invalidPayloads) {
			const response = await client
				.visit("admin.firms.create")
				.withGuard("admin")
				.loginAs(admin)
				.json(payload);

			response.assertStatus(422);
		}
	});

	test("it should reject unauthenticated requests", async ({ client }) => {
		const response = await client.visit("admin.firms.create").json(validPayload);

		response.assertUnauthorized();
		response.assertBodyContains({ code: "E_UNAUTHENTICATED" });
	});
});
