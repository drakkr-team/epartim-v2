import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import { NetworkFactory } from "#database/factories/network.factory";

test.group("Features / Admin / Networks / Controllers / List Controller", () => {
	test("it should return pagination, action metadata, and relation identifiers", async ({
		client,
		assert,
	}) => {
		const admin = await AdminFactory.create();
		const network = await NetworkFactory.merge({ name: "List Contract Network" })
			.with("address")
			.with("paymentDetails")
			.create();

		const response = await client
			.visit("admin.networks.list")
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
		assert.deepEqual(Object.keys(body.data[0].meta).sort(), ["canDelete", "canUpdate"]);
		assert.deepEqual(body.data[0].meta, {
			canUpdate: true,
			canDelete: true,
		});
		assert.equal(body.data[0].addressId, network.addressId);
		assert.equal(body.data[0].paymentDetailId, network.paymentDetailId);
		assert.notProperty(body.data[0], "address");
		assert.notProperty(body.data[0], "paymentDetails");
		assert.property(body.data[0], "createdAt");
		assert.property(body.data[0], "updatedAt");
	});

	test("it should paginate and search only by network name", async ({ client, assert }) => {
		const admin = await AdminFactory.create();
		const first = await NetworkFactory.merge({
			name: "NameOnly Match One",
			amundiOrgId: "HIDDEN-ONE",
		})
			.with("address")
			.with("paymentDetails")
			.create();
		const second = await NetworkFactory.merge({
			name: "NameOnly Match Two",
			amundiOrgId: "HIDDEN-TWO",
		})
			.with("address")
			.with("paymentDetails")
			.create();

		const pageResponse = await client
			.visit("admin.networks.list")
			.withGuard("admin")
			.loginAs(admin)
			.qs({ q: "NameOnly Match", orderBy: "id_asc", page: 2, perPage: 1 });

		pageResponse.assertOk();
		pageResponse.assertBodyContains({
			meta: { currentPage: 2, perPage: 1, total: 2 },
			data: [{ id: second.id }],
		});

		const hiddenFieldResponse = await client
			.visit("admin.networks.list")
			.withGuard("admin")
			.loginAs(admin)
			.qs({ q: first.amundiOrgId });

		hiddenFieldResponse.assertOk();
		assert.equal(hiddenFieldResponse.body().meta.total, 0);
		assert.deepEqual(hiddenFieldResponse.body().data, []);
	});

	test("it should reject invalid pagination and ignore unknown sorting options", async ({
		client,
	}) => {
		const admin = await AdminFactory.create();

		for (const query of [{ page: 0 }, { perPage: 1.5 }]) {
			const response = await client
				.get("/admin/networks")
				.withGuard("admin")
				.loginAs(admin)
				.qs(query);

			response.assertStatus(422);
		}

		for (const orderBy of ["address_asc", "name_sideways"]) {
			const response = await client
				.get("/admin/networks")
				.withGuard("admin")
				.loginAs(admin)
				.qs({ orderBy });

			response.assertOk();
		}
	});

	test("it should reject unauthenticated requests", async ({ client }) => {
		const response = await client.visit("admin.networks.list");

		response.assertUnauthorized();
		response.assertBodyContains({
			code: "E_UNAUTHENTICATED",
		});
	});
});
