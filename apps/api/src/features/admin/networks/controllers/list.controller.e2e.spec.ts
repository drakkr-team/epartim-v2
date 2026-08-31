import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import { NetworkFactory } from "#database/factories/network.factory";

test.group("Features / Admin / Networks / Controllers / List Controller", () => {
	test("it should return the exact metadata and expanded relation contract", async ({
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
		assert.deepEqual(Object.keys(body.meta).sort(), ["canCreate", "page", "perPage", "total"]);
		assert.deepEqual(body.meta, {
			page: 1,
			perPage: 20,
			total: 1,
			canCreate: true,
		});
		assert.lengthOf(body.data, 1);
		assert.deepEqual(Object.keys(body.data[0].meta).sort(), ["canDelete", "canUpdate"]);
		assert.deepEqual(body.data[0].meta, {
			canUpdate: true,
			canDelete: true,
		});
		assert.equal(body.data[0].addressId, network.addressId);
		assert.equal(body.data[0].address.id, network.addressId);
		assert.equal(body.data[0].paymentDetailsId, network.paymentDetailsId);
		assert.equal(body.data[0].paymentDetails.id, network.paymentDetailsId);
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
			meta: { page: 2, perPage: 1, total: 2 },
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

	test("it should reject invalid pagination and sorting options", async ({ client }) => {
		const admin = await AdminFactory.create();

		for (const query of [
			{ page: 0 },
			{ perPage: 1.5 },
			{ orderBy: "address_asc" },
			{ orderBy: "name_sideways" },
		]) {
			const response = await client
				.get("/admin/networks")
				.withGuard("admin")
				.loginAs(admin)
				.qs(query);

			response.assertStatus(422);
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
