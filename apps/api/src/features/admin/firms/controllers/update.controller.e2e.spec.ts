import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import { FirmFactory } from "#database/factories/firm.factory";
import { NetworkFactory } from "#database/factories/network.factory";
import Address from "#models/address";
import PaymentDetail from "#models/payment_detail";

async function createUpdateFixture(name: string, orias: string) {
	const firm = await FirmFactory.merge({
		name,
		amundiOrgId: `AMUNDI-${orias}`,
		orias,
	})
		.with("address")
		.with("paymentDetail")
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
		const admin = await AdminFactory.create();
		const firm = await createUpdateFixture("Original Firm", "51000001");

		const response = await client
			.put(`/admin/firms/${firm.id}`)
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
	});

	test("it should preserve, detach, and attach the network explicitly", async ({
		client,
		assert,
	}) => {
		const admin = await AdminFactory.create();
		const firstNetwork = await NetworkFactory.with("address").with("paymentDetail").create();
		const secondNetwork = await NetworkFactory.with("address").with("paymentDetail").create();
		const firm = await createUpdateFixture("Network Semantics Firm", "51000002");
		await firm.merge({ networkId: firstNetwork.id }).save();

		const preserved = await client
			.put(`/admin/firms/${firm.id}`)
			.withGuard("admin")
			.loginAs(admin)
			.json({ name: "Network Preserved Firm" });
		preserved.assertOk();
		assert.equal(preserved.body().networkId, firstNetwork.id);

		const detached = await client
			.put(`/admin/firms/${firm.id}`)
			.withGuard("admin")
			.loginAs(admin)
			.json({ networkId: null });
		detached.assertOk();
		assert.isNull(detached.body().networkId);

		const attached = await client
			.put(`/admin/firms/${firm.id}`)
			.withGuard("admin")
			.loginAs(admin)
			.json({ networkId: secondNetwork.id });
		attached.assertOk();
		assert.equal(attached.body().networkId, secondNetwork.id);
	});

	test("it should ignore amundiOrgId supplied during update", async ({ client, assert }) => {
		const admin = await AdminFactory.create();
		const firm = await createUpdateFixture("Generated Amundi Firm", "51000008");
		const initialAmundiOrgId = firm.amundiOrgId;

		const response = await client
			.put(`/admin/firms/${firm.id}`)
			.withGuard("admin")
			.loginAs(admin)
			.json({ amundiOrgId: "AMUNDI-FORCED" });

		response.assertOk();
		await firm.refresh();
		assert.equal(firm.amundiOrgId, initialAmundiOrgId);
	});

	test("it should reject duplicate editable unique values", async ({ client }) => {
		const admin = await AdminFactory.create();
		const target = await createUpdateFixture("Unique Target Firm", "51000003");
		const existing = await createUpdateFixture("Unique Existing Firm", "51000004");

		for (const payload of [{ name: existing.name }, { orias: existing.orias }]) {
			const response = await client
				.put(`/admin/firms/${target.id}`)
				.withGuard("admin")
				.loginAs(admin)
				.json(payload);

			response.assertStatus(422);
		}
	});

	test("it should allow a no-op payload", async ({ client, assert }) => {
		const admin = await AdminFactory.create();
		const firm = await createUpdateFixture("No-op Firm", "51000005");

		const response = await client
			.put(`/admin/firms/${firm.id}`)
			.withGuard("admin")
			.loginAs(admin)
			.json({});

		response.assertOk();
		assert.equal(response.body().addressId, firm.addressId);
		assert.equal(response.body().paymentDetailId, firm.paymentDetailId);
	});

	test("it should reject invalid owned fields and references", async ({ client }) => {
		const admin = await AdminFactory.create();
		const firm = await createUpdateFixture("Validation Firm", "51000006");

		for (const payload of [{ address: {} }, { paymentDetail: {} }, { networkId: 999_999_999 }]) {
			const response = await client
				.put(`/admin/firms/${firm.id}`)
				.withGuard("admin")
				.loginAs(admin)
				.json(payload);

			response.assertStatus(422);
		}
	});

	test("it should reject malformed partial values", async ({ client }) => {
		const admin = await AdminFactory.create();
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
				.put(`/admin/firms/${firm.id}`)
				.withGuard("admin")
				.loginAs(admin)
				.json(payload);

			response.assertStatus(422);
		}
	});

	test("it should return not found for an unknown firmId", async ({ client }) => {
		const admin = await AdminFactory.create();

		const response = await client
			.put("/admin/firms/999999999")
			.withGuard("admin")
			.loginAs(admin)
			.json({ name: "Missing Firm" });

		response.assertNotFound();
	});

	test("it should reject unauthenticated requests", async ({ client }) => {
		const response = await client.put("/admin/firms/1").json({ name: "Unauthorized Firm" });

		response.assertUnauthorized();
		response.assertBodyContains({
			code: "E_UNAUTHENTICATED",
		});
	});
});
