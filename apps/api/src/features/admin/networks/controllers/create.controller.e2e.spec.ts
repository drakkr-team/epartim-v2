import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import { NetworkFactory } from "#database/factories/network.factory";
import Network from "#models/network";

const validPayload = {
	name: "Réseau Démo",
	amundiOrgId: "AMUNDI-109",
	goCode: 109_001,
	address: {
		lineOne: "10 rue de la Paix",
		lineTwo: "Bâtiment A",
		zip: "75002",
		city: "Paris",
		coordinates: {
			latitude: 48.8686,
			longitude: 2.3305,
		},
	},
	paymentDetails: {
		iban: "fr76 3000 6000 0112 3456 7890 189",
		bic: "agri fr pp",
	},
};

test.group("Features / Admin / Networks / Controllers / Create Controller", () => {
	test("it should atomically create and return a network with its owned relations", async ({
		client,
		assert,
	}) => {
		const admin = await AdminFactory.create();

		const response = await client
			.visit("admin.networks.create")
			.withGuard("admin")
			.loginAs(admin)
			.json(validPayload);

		response.assertCreated();
		response.assertBodyContains({
			name: validPayload.name,
			amundiOrgId: validPayload.amundiOrgId,
			goCode: validPayload.goCode,
			address: validPayload.address,
			paymentDetails: {
				iban: "FR7630006000011234567890189",
				bic: "AGRIFRPP",
			},
		});

		const body = response.body();
		assert.equal(body.addressId, body.address.id);
		assert.equal(body.paymentDetailsId, body.paymentDetails.id);

		const network = await Network.query()
			.where("name", validPayload.name)
			.preload("address")
			.preload("paymentDetails")
			.firstOrFail();
		assert.equal(network.address.id, body.addressId);
		assert.equal(network.paymentDetails.id, body.paymentDetailsId);
		assert.equal(network.paymentDetails.iban, "FR7630006000011234567890189");
		assert.equal(network.paymentDetails.bic, "AGRIFRPP");
	});

	test("it should require the network and owned relation fields", async ({ client }) => {
		const admin = await AdminFactory.create();

		const response = await client
			.visit("admin.networks.create")
			.withGuard("admin")
			.loginAs(admin)
			.json({
				name: "",
				address: {
					lineOne: "",
					zip: "",
					city: "",
				},
				paymentDetails: {
					iban: "",
					bic: "",
				},
			});

		response.assertStatus(422);
	});

	test("it should reject duplicate names and non-null Amundi organization IDs", async ({
		client,
	}) => {
		const admin = await AdminFactory.create();
		const existing = await NetworkFactory.with("address").with("paymentDetails").create();

		const duplicateName = await client
			.visit("admin.networks.create")
			.withGuard("admin")
			.loginAs(admin)
			.json({
				...validPayload,
				name: existing.name,
				amundiOrgId: "OTHER-AMUNDI-ID",
			});
		duplicateName.assertStatus(422);

		const duplicateAmundiOrgId = await client
			.visit("admin.networks.create")
			.withGuard("admin")
			.loginAs(admin)
			.json({
				...validPayload,
				name: "Another Network",
				amundiOrgId: existing.amundiOrgId,
			});
		duplicateAmundiOrgId.assertStatus(422);
	});

	test("it should accept nullable Amundi organization IDs and go codes", async ({ client }) => {
		const admin = await AdminFactory.create();

		for (const name of ["Nullable Network A", "Nullable Network B"]) {
			const response = await client
				.visit("admin.networks.create")
				.withGuard("admin")
				.loginAs(admin)
				.json({
					...validPayload,
					name,
					amundiOrgId: null,
					goCode: null,
				});

			response.assertCreated();
			response.assertBodyContains({ amundiOrgId: null, goCode: null });
		}
	});

	test("it should reject invalid go codes, coordinates, IBANs, and BICs", async ({ client }) => {
		const admin = await AdminFactory.create();
		const invalidPayloads = [
			{ ...validPayload, name: "Decimal", goCode: 10.5 },
			{
				...validPayload,
				name: "Latitude",
				address: {
					...validPayload.address,
					coordinates: { latitude: 91, longitude: 2 },
				},
			},
			{
				...validPayload,
				name: "Longitude",
				address: {
					...validPayload.address,
					coordinates: { latitude: 48, longitude: -181 },
				},
			},
			{
				...validPayload,
				name: "IBAN",
				paymentDetails: { ...validPayload.paymentDetails, iban: "FR001234" },
			},
			{
				...validPayload,
				name: "BIC",
				paymentDetails: { ...validPayload.paymentDetails, bic: "INVALID" },
			},
		];

		for (const payload of invalidPayloads) {
			const response = await client
				.visit("admin.networks.create")
				.withGuard("admin")
				.loginAs(admin)
				.json(payload);
			response.assertStatus(422);
		}
	});

	test("it should reject unauthenticated requests", async ({ client }) => {
		const response = await client.visit("admin.networks.create").json(validPayload);

		response.assertUnauthorized();
		response.assertBodyContains({
			code: "E_UNAUTHENTICATED",
		});
	});
});
