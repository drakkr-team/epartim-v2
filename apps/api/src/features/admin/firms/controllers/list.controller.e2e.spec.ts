import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import { FirmFactory } from "#database/factories/firm.factory";
import { NetworkFactory } from "#database/factories/network.factory";

test.group("Features / Admin / Firms / Controllers / List Controller", () => {
	test("it should return firms with owned relations and action metadata", async ({
		client,
		assert,
	}) => {
		const admin = await AdminFactory.create();
		const network = await NetworkFactory.with("address").with("paymentDetails").create();
		const firm = await FirmFactory.merge({
			name: "List Contract Firm",
			networkId: network.id,
		})
			.with("address")
			.with("paymentDetails")
			.create();

		const response = await client
			.get("/admin/firms")
			.withGuard("admin")
			.loginAs(admin)
			.qs({ q: "List Contract" });

		response.assertOk();
		const body = response.body();
		assert.deepEqual(Object.keys(body.meta).sort(), [
			"canCreate",
			"currentPage",
			"firstPage",
			"hasMorePages",
			"hasPages",
			"isEmpty",
			"lastPage",
			"perPage",
			"total",
		]);
		assert.deepEqual(body.meta, {
			perPage: 20,
			currentPage: 1,
			total: 1,
			firstPage: 1,
			lastPage: 1,
			isEmpty: false,
			hasPages: false,
			hasMorePages: false,
			canCreate: true,
		});
		assert.lengthOf(body.data, 1);
		assert.deepEqual(body.data[0].meta, {
			canUpdate: true,
			canDelete: true,
		});
		assert.equal(body.data[0].addressId, firm.addressId);
		assert.equal(body.data[0].paymentDetailsId, firm.paymentDetailsId);
		assert.equal(body.data[0].networkId, network.id);
		assert.equal(body.data[0].address.id, firm.addressId);
		assert.equal(body.data[0].paymentDetails.id, firm.paymentDetailsId);
		assert.notProperty(body.data[0], "network");
	});

	test("it should paginate and search only by firm name", async ({ client, assert }) => {
		const admin = await AdminFactory.create();
		const first = await FirmFactory.merge({
			name: "NameOnly Firm One",
			amundiOrgId: "HIDDEN-FIRM-ONE",
			orias: "10000001",
		})
			.with("address")
			.with("paymentDetails")
			.create();
		const second = await FirmFactory.merge({
			name: "NameOnly Firm Two",
			amundiOrgId: "HIDDEN-FIRM-TWO",
			orias: "10000002",
		})
			.with("address")
			.with("paymentDetails")
			.create();

		const pageResponse = await client
			.get("/admin/firms")
			.withGuard("admin")
			.loginAs(admin)
			.qs({ q: "NameOnly Firm", orderBy: "id_asc", page: 2, perPage: 1 });

		pageResponse.assertOk();
		pageResponse.assertBodyContains({
			meta: { currentPage: 2, perPage: 1, total: 2 },
			data: [{ id: second.id }],
		});

		for (const q of ["HIDDEN-FIRM-ONE", first.orias]) {
			const hiddenFieldResponse = await client
				.get("/admin/firms")
				.withGuard("admin")
				.loginAs(admin)
				.qs({ q });

			hiddenFieldResponse.assertOk();
			assert.equal(hiddenFieldResponse.body().meta.total, 0);
			assert.deepEqual(hiddenFieldResponse.body().data, []);
		}
	});

	test("it should filter by network and return an empty list for an unmatched network", async ({
		client,
		assert,
	}) => {
		const admin = await AdminFactory.create();
		const firstNetwork = await NetworkFactory.with("address").with("paymentDetails").create();
		const secondNetwork = await NetworkFactory.with("address").with("paymentDetails").create();
		const matchingFirm = await FirmFactory.merge({
			name: "Filtered Firm",
			networkId: firstNetwork.id,
		})
			.with("address")
			.with("paymentDetails")
			.create();
		await FirmFactory.merge({
			name: "Other Network Firm",
			networkId: secondNetwork.id,
		})
			.with("address")
			.with("paymentDetails")
			.create();

		const response = await client
			.get("/admin/firms")
			.withGuard("admin")
			.loginAs(admin)
			.qs({ networkId: Number(firstNetwork.id) });

		response.assertOk();
		assert.deepEqual(
			response.body().data.map((firm) => firm.id),
			[matchingFirm.id],
		);

		const emptyResponse = await client
			.get("/admin/firms")
			.withGuard("admin")
			.loginAs(admin)
			.qs({ networkId: 999_999_999 });

		emptyResponse.assertOk();
		assert.equal(emptyResponse.body().meta.total, 0);
		assert.deepEqual(emptyResponse.body().data, []);
	});

	test("it should reject invalid query parameters", async ({ client }) => {
		const admin = await AdminFactory.create();

		for (const url of [
			"/admin/firms?page=0",
			"/admin/firms?perPage=1.5",
			"/admin/firms?networkId=0",
			"/admin/firms?networkId=1.5",
			"/admin/firms?orderBy=address_asc",
			"/admin/firms?orderBy=name_sideways",
		]) {
			const response = await client.get(url).withGuard("admin").loginAs(admin);

			response.assertStatus(422);
		}
	});

	test("it should reject unauthenticated requests", async ({ client }) => {
		const response = await client.get("/admin/firms");

		response.assertUnauthorized();
		response.assertBodyContains({
			code: "E_UNAUTHENTICATED",
		});
	});
});
