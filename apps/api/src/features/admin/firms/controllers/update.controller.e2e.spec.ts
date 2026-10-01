import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import { FirmFactory } from "#database/factories/firm.factory";
import { NetworkFactory } from "#database/factories/network.factory";
import Address from "#models/address";
import CommissionRate from "#models/commission_rate";
import PaymentDetail from "#models/payment_detail";
import Role from "#models/role";

async function createUpdateFixture(name: string, orias: string) {
	const firm = await FirmFactory.merge({
		name,
		amundiOrgId: `AMUNDI-${orias}`,
		orias,
	})
		.with("address")
		.with("paymentDetail")
		.with("commissionRate")
		.create();
	await Address.query().where("id", Number(firm.addressId)).update({ city: "Paris" });
	await PaymentDetail.query().where("id", Number(firm.paymentDetailId)).update({
		iban: "FR7630006000011234567890189",
		bic: "AGRIFRPP",
	});
	return firm;
}

test.group("Features / Admin / Firms / Controllers / Update Controller", () => {
	test("it should update the firm and owned relations", async ({ client, assert }) => {
		const admin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["update:firm"];
		await role.save();
		const firm = await createUpdateFixture("Original Firm", "51000001");

		const response = await client
			.visit("admin.firms.update", { firmId: firm.id })
			.withGuard("admin")
			.loginAs(admin)
			.json({
				name: "Updated Firm",
				address: {
					lineOne: "10 rue de Paris",
					lineTwo: "Bâtiment A",
					zip: "75001",
					city: "Lyon",
				},
				paymentDetail: {
					iban: "fr76 3000 6000 0112 3456 7890 189",
					bic: "agri fr pp",
				},
				commissionRate: {
					shortTermRatePercent: 0,
					mediumTermRatePercent: 12.5,
					longTermRatePercent: 100,
				},
			});

		response.assertOk();
		response.assertBodyContains({
			id: firm.id,
			name: "Updated Firm",
			addressId: firm.addressId,
			paymentDetailId: firm.paymentDetailId,
		});
		assert.notProperty(response.body(), "meta");
		assert.equal((await Address.findOrFail(firm.addressId)).city, "Lyon");
		const paymentDetail = await PaymentDetail.findOrFail(firm.paymentDetailId);
		assert.equal(paymentDetail.iban, "FR76 3000 6000 0112 3456 7890 189");
		assert.equal(paymentDetail.bic, "AGRI FR PP");
		const commissionRate = await CommissionRate.findOrFail(firm.commissionRateId);
		assert.equal(commissionRate.shortTermRatePercent, 0);
		assert.equal(commissionRate.mediumTermRatePercent, 12.5);
		assert.equal(commissionRate.longTermRatePercent, 100);
		await firm.refresh();
		assert.equal(firm.commissionRateId, commissionRate.id);
	});

	test("it should preserve commission rates when omitted from an update", async ({
		client,
		assert,
	}) => {
		const admin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["update:firm"];
		await role.save();
		const firm = await createUpdateFixture("Preserved Rate Firm", "51000009");
		const commissionRate = await CommissionRate.findOrFail(firm.commissionRateId);
		await commissionRate
			.merge({
				shortTermRatePercent: 12.5,
				mediumTermRatePercent: 25,
				longTermRatePercent: 37.5,
			})
			.save();

		const response = await client
			.visit("admin.firms.update", { firmId: firm.id })
			.withGuard("admin")
			.loginAs(admin)
			.json({ name: "Renamed Preserved Rate Firm" });

		response.assertOk();
		await firm.refresh();
		await commissionRate.refresh();
		assert.equal(firm.commissionRateId, commissionRate.id);
		assert.equal(commissionRate.shortTermRatePercent, 12.5);
		assert.equal(commissionRate.mediumTermRatePercent, 25);
		assert.equal(commissionRate.longTermRatePercent, 37.5);
	});

	test("it should partially update commission rates and preserve omitted or null fields", async ({
		client,
		assert,
	}) => {
		const admin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["update:firm"];
		await role.save();
		const firm = await createUpdateFixture("Partial Rate Firm", "51000011");
		const rates = {
			shortTermRatePercent: 12.5,
			mediumTermRatePercent: 25,
			longTermRatePercent: 37.5,
		};
		const commissionRate = await CommissionRate.findOrFail(firm.commissionRateId);
		await commissionRate.merge(rates).save();

		const response = await client
			.visit("admin.firms.update", { firmId: firm.id })
			.withGuard("admin")
			.loginAs(admin)
			.unsafeJson({
				commissionRate: { shortTermRatePercent: 0, mediumTermRatePercent: null },
			});

		response.assertOk();
		await firm.refresh();
		await commissionRate.refresh();
		assert.equal(firm.commissionRateId, commissionRate.id);
		assert.equal(commissionRate.shortTermRatePercent, 0);
		assert.equal(commissionRate.mediumTermRatePercent, rates.mediumTermRatePercent);
		assert.equal(commissionRate.longTermRatePercent, rates.longTermRatePercent);
	});

	test("it should reject invalid commission rate updates", async ({ client, assert }) => {
		const admin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["update:firm"];
		await role.save();
		const firm = await createUpdateFixture("Invalid Rate Update Firm", "51000010");
		const rates = {
			shortTermRatePercent: 12.5,
			mediumTermRatePercent: 25,
			longTermRatePercent: 37.5,
		};
		const commissionRate = await CommissionRate.findOrFail(firm.commissionRateId);
		await commissionRate.merge(rates).save();

		for (const invalidRate of [
			...Object.keys(rates).flatMap((field) =>
				[-0.5, 100.5, "invalid"].map((value) => ({ ...rates, [field]: value })),
			),
		]) {
			const response = await client
				.visit("admin.firms.update", { firmId: firm.id })
				.withGuard("admin")
				.loginAs(admin)
				.unsafeJson({ name: "Rejected Rate Update", commissionRate: invalidRate });

			response.assertStatus(422);
			await firm.refresh();
			await commissionRate.refresh();
			assert.equal(firm.name, "Invalid Rate Update Firm");
			assert.equal(commissionRate.shortTermRatePercent, rates.shortTermRatePercent);
			assert.equal(commissionRate.mediumTermRatePercent, rates.mediumTermRatePercent);
			assert.equal(commissionRate.longTermRatePercent, rates.longTermRatePercent);
		}
	});

	test("it should preserve, detach, and attach the network explicitly", async ({
		client,
		assert,
	}) => {
		const admin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["update:firm"];
		await role.save();
		const firstNetwork = await NetworkFactory.with("address")
			.with("paymentDetail")
			.with("commissionRate")
			.create();
		const secondNetwork = await NetworkFactory.with("address")
			.with("paymentDetail")
			.with("commissionRate")
			.create();
		const firm = await createUpdateFixture("Network Semantics Firm", "51000002");
		await firm.merge({ networkId: firstNetwork.id }).save();

		const preserved = await client
			.visit("admin.firms.update", { firmId: firm.id })
			.withGuard("admin")
			.loginAs(admin)
			.json({ name: "Network Preserved Firm" });
		preserved.assertOk();
		assert.equal(preserved.body().networkId, firstNetwork.id);

		const detached = await client
			.visit("admin.firms.update", { firmId: firm.id })
			.withGuard("admin")
			.loginAs(admin)
			.json({ networkId: null });
		detached.assertOk();
		assert.isNull(detached.body().networkId);

		const attached = await client
			.visit("admin.firms.update", { firmId: firm.id })
			.withGuard("admin")
			.loginAs(admin)
			.json({ networkId: secondNetwork.id });
		attached.assertOk();
		assert.equal(attached.body().networkId, secondNetwork.id);
	});

	test("it should ignore amundiOrgId supplied during update", async ({ client, assert }) => {
		const admin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["update:firm"];
		await role.save();
		const firm = await createUpdateFixture("Generated Amundi Firm", "51000008");
		const initialAmundiOrgId = firm.amundiOrgId;

		const response = await client
			.visit("admin.firms.update", { firmId: firm.id })
			.withGuard("admin")
			.loginAs(admin)
			.unsafeJson({ amundiOrgId: "AMUNDI-FORCED" });

		response.assertOk();
		await firm.refresh();
		assert.equal(firm.amundiOrgId, initialAmundiOrgId);
	});

	test("it should reject duplicate editable unique values", async ({ client }) => {
		const admin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["update:firm"];
		await role.save();
		const target = await createUpdateFixture("Unique Target Firm", "51000003");
		const existing = await createUpdateFixture("Unique Existing Firm", "51000004");

		for (const payload of [{ name: existing.name }, { orias: existing.orias }]) {
			const response = await client
				.visit("admin.firms.update", { firmId: target.id })
				.withGuard("admin")
				.loginAs(admin)
				.json(payload);

			response.assertStatus(422);
		}
	});

	test("it should allow a no-op payload", async ({ client, assert }) => {
		const admin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["update:firm"];
		await role.save();
		const firm = await createUpdateFixture("No-op Firm", "51000005");
		await firm.load("commissionRate");

		for (const payload of [{}, { address: {}, paymentDetail: {}, commissionRate: {} }]) {
			const response = await client
				.visit("admin.firms.update", { firmId: firm.id })
				.withGuard("admin")
				.loginAs(admin)
				.json(payload);

			response.assertOk();
			assert.equal(response.body().addressId, firm.addressId);
			assert.equal(response.body().paymentDetailId, firm.paymentDetailId);
			await firm.refresh();
			assert.equal(firm.commissionRateId, firm.commissionRate.id);
			assert.equal((await Address.findOrFail(firm.addressId)).city, "Paris");
			const paymentDetail = await PaymentDetail.findOrFail(firm.paymentDetailId);
			assert.equal(paymentDetail.iban, "FR7630006000011234567890189");
			assert.equal(paymentDetail.bic, "AGRIFRPP");
			const commissionRate = await CommissionRate.findOrFail(firm.commissionRateId);
			assert.equal(commissionRate.shortTermRatePercent, firm.commissionRate.shortTermRatePercent);
			assert.equal(commissionRate.mediumTermRatePercent, firm.commissionRate.mediumTermRatePercent);
			assert.equal(commissionRate.longTermRatePercent, firm.commissionRate.longTermRatePercent);
		}
	});

	test("it should reject an unknown network reference", async ({ client }) => {
		const admin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["update:firm"];
		await role.save();
		const firm = await createUpdateFixture("Validation Firm", "51000006");

		const response = await client
			.visit("admin.firms.update", { firmId: firm.id })
			.withGuard("admin")
			.loginAs(admin)
			.json({ networkId: 999_999_999 });

		response.assertStatus(422);
	});

	test("it should reject malformed partial values", async ({ client }) => {
		const admin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["update:firm"];
		await role.save();
		const firm = await createUpdateFixture("Malformed Firm", "51000007");

		for (const payload of [
			{
				address: {
					lineOne: "10 Validation Street",
					zip: "75001",
					city: "Paris",
					coordinates: { latitude: 91, longitude: 0 },
				},
			},
			{ paymentDetail: { iban: "FR001234", bic: "AGRIFRPP" } },
			{
				paymentDetail: {
					iban: "FR7630006000011234567890189",
					bic: "INVALID",
				},
			},
		]) {
			const response = await client
				.visit("admin.firms.update", { firmId: firm.id })
				.withGuard("admin")
				.loginAs(admin)
				.json(payload);

			response.assertStatus(422);
		}
	});

	test("it should return not found for an unknown firmId", async ({ client }) => {
		const admin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["update:firm"];
		await role.save();

		const response = await client
			.visit("admin.firms.update", { firmId: 999_999_999 })
			.withGuard("admin")
			.loginAs(admin)
			.json({ name: "Missing Firm" });

		response.assertNotFound();
	});

	test("it should reject unauthenticated requests", async ({ client }) => {
		const response = await client
			.visit("admin.firms.update", { firmId: 1 })
			.json({ name: "Unauthorized Firm" });

		response.assertUnauthorized();
		response.assertBodyContains({
			code: "E_UNAUTHENTICATED",
		});
	});
});
