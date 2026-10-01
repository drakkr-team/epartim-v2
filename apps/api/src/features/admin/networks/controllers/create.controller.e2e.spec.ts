import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import { NetworkFactory } from "#database/factories/network.factory";
import Network from "#models/network";
import Role from "#models/role";

const validPayload = {
	name: "Réseau Démo",
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
	paymentDetail: {
		iban: "fr76 3000 6000 0112 3456 7890 189",
		bic: "agri fr pp",
	},
	commissionRate: {
		shortTermRatePercent: 12.5,
		mediumTermRatePercent: 25,
		longTermRatePercent: 37.5,
	},
};

test.group("Features / Admin / Networks / Controllers / Create Controller", () => {
	test("it should atomically create owned records and return their identifiers", async ({
		client,
		assert,
	}) => {
		const admin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["create:network"];
		await role.save();

		const response = await client
			.visit("admin.networks.create")
			.withGuard("admin")
			.loginAs(admin)
			.json(validPayload);

		response.assertCreated();
		response.assertBodyContains({
			name: validPayload.name,
		});

		const body = response.body();
		assert.property(body, "addressId");
		assert.property(body, "paymentDetailId");

		const network = await Network.query()
			.where("name", validPayload.name)
			.preload("address")
			.preload("paymentDetail")
			.preload("commissionRate")
			.firstOrFail();
		assert.equal(network.address.id, body.addressId);
		assert.equal(network.paymentDetail.id, body.paymentDetailId);
		assert.equal(
			network.commissionRate.shortTermRatePercent,
			validPayload.commissionRate.shortTermRatePercent,
		);
		assert.equal(
			network.commissionRate.mediumTermRatePercent,
			validPayload.commissionRate.mediumTermRatePercent,
		);
		assert.equal(
			network.commissionRate.longTermRatePercent,
			validPayload.commissionRate.longTermRatePercent,
		);
		assert.equal(network.paymentDetail.iban, "FR76 3000 6000 0112 3456 7890 189");
		assert.equal(network.paymentDetail.bic, "AGRI FR PP");
	});

	test("it should accept commission rates at both inclusive boundaries", async ({
		client,
		assert,
	}) => {
		const admin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["create:network"];
		await role.save();

		for (const rate of [0, 100]) {
			const commissionRate = {
				shortTermRatePercent: rate,
				mediumTermRatePercent: rate,
				longTermRatePercent: rate,
			};
			const response = await client
				.visit("admin.networks.create")
				.withGuard("admin")
				.loginAs(admin)
				.json({ ...validPayload, name: `Rate Boundary ${rate}`, commissionRate });

			response.assertCreated();
			const network = await Network.query()
				.where("id", response.body().id)
				.preload("commissionRate")
				.firstOrFail();
			assert.equal(network.commissionRate.shortTermRatePercent, rate);
			assert.equal(network.commissionRate.mediumTermRatePercent, rate);
			assert.equal(network.commissionRate.longTermRatePercent, rate);
		}
	});

	test("it should require a commission rate object and every nested field", async ({ client }) => {
		const admin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["create:network"];
		await role.save();
		const invalidRates = [
			{ commissionRate: undefined, field: "commissionRate" },
			{ commissionRate: {}, field: "commissionRate.shortTermRatePercent" },
			...Object.keys(validPayload.commissionRate).map((field) => ({
				commissionRate: { ...validPayload.commissionRate, [field]: undefined },
				field: `commissionRate.${field}`,
			})),
		];

		for (const { commissionRate, field } of invalidRates) {
			const response = await client
				.visit("admin.networks.create")
				.withGuard("admin")
				.loginAs(admin)
				.unsafeJson({ ...validPayload, commissionRate });

			response.assertStatus(422);
			response.assertBodyContains({ errors: [{ field, rule: "required" }] });
		}
	});

	test("it should reject out of range and nonnumeric commission rates", async ({ client }) => {
		const admin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["create:network"];
		await role.save();

		for (const field of Object.keys(validPayload.commissionRate)) {
			for (const value of [-0.5, 100.5, "invalid", null]) {
				const response = await client
					.visit("admin.networks.create")
					.withGuard("admin")
					.loginAs(admin)
					.unsafeJson({
						...validPayload,
						commissionRate: { ...validPayload.commissionRate, [field]: value },
					});

				response.assertStatus(422);
				response.assertBodyContains({ errors: [{ field: `commissionRate.${field}` }] });
			}
		}
	});

	test("it should require the network and owned relation fields", async ({ client }) => {
		const admin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["create:network"];
		await role.save();

		const response = await client
			.visit("admin.networks.create")
			.withGuard("admin")
			.loginAs(admin)
			.json({
				...validPayload,
				name: "",
				address: {
					...validPayload.address,
					lineOne: "",
				},
				paymentDetail: {
					...validPayload.paymentDetail,
					iban: "",
				},
			});

		response.assertStatus(422);
	});

	test("it should reject duplicate names", async ({ client }) => {
		const admin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["create:network"];
		await role.save();
		const existing = await NetworkFactory.with("address")
			.with("paymentDetail")
			.with("commissionRate")
			.create();

		const duplicateName = await client
			.visit("admin.networks.create")
			.withGuard("admin")
			.loginAs(admin)
			.json({
				...validPayload,
				name: existing.name,
			});
		duplicateName.assertStatus(422);
	});

	test("it should ignore read-only identifiers supplied during creation", async ({
		client,
		assert,
	}) => {
		const admin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["create:network"];
		await role.save();

		const response = await client
			.visit("admin.networks.create")
			.withGuard("admin")
			.loginAs(admin)
			.unsafeJson({
				...validPayload,
				name: "Server Managed Identifiers",
				amundiOrgId: "AMUNDI-FORCED",
				goCode: "FORCED",
			});

		response.assertCreated();
		assert.notProperty(response.body(), "amundiOrgId");
		assert.notProperty(response.body(), "goCode");

		const persistedNetwork = await Network.findByOrFail("name", "Server Managed Identifiers");
		assert.isNull(persistedNetwork.amundiOrgId);
		assert.isNull(persistedNetwork.goCode);
	});

	test("it should reject invalid coordinates, IBANs, and BICs", async ({ client }) => {
		const admin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["create:network"];
		await role.save();
		const invalidPayloads = [
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
				paymentDetail: { ...validPayload.paymentDetail, iban: "FR001234" },
			},
			{
				...validPayload,
				name: "BIC",
				paymentDetail: { ...validPayload.paymentDetail, bic: "INVALID" },
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
