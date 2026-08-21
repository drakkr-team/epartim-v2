import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";

test.group("Features / Admin / Admins / Controllers / List Controller", () => {
	test("it should return paginated admins with authorization metadata", async ({
		client,
		assert,
	}) => {
		const currentAdmin = await AdminFactory.merge({
			name: "Metadata Current Admin",
			email: "metadata.current.admin@example.com",
		}).create();
		const otherAdmin = await AdminFactory.merge({
			name: "Metadata Other Admin",
			email: "metadata.other.admin@example.com",
		}).create();

		const response = await client
			.visit("admin.admins.list")
			.withGuard("admin")
			.loginAs(currentAdmin)
			.qs({ q: "Metadata" });

		response.assertOk();
		response.assertBodyContains({
			meta: {
				currentPage: 1,
				perPage: 20,
				total: 2,
				canCreate: true,
			},
		});

		const body = response.body();
		const currentAdminItem = body.data.find(
			(admin: { id: number }) => admin.id === currentAdmin.id,
		);
		const otherAdminItem = body.data.find((admin: { id: number }) => admin.id === otherAdmin.id);

		assert.deepInclude(currentAdminItem, {
			name: currentAdmin.name,
			meta: {
				canUpdate: true,
				canDelete: false,
			},
		});
		assert.deepInclude(otherAdminItem, {
			name: otherAdmin.name,
			meta: {
				canUpdate: true,
				canDelete: true,
			},
		});
	});

	test("it should apply pagination query parameters", async ({ client }) => {
		const currentAdmin = await AdminFactory.merge({ name: "Pagination Admin One" }).create();
		const secondAdmin = await AdminFactory.merge({ name: "Pagination Admin Two" }).create();
		await AdminFactory.merge({ name: "Pagination Admin Three" }).create();

		const response = await client
			.visit("admin.admins.list")
			.withGuard("admin")
			.loginAs(currentAdmin)
			.qs({
				page: 2,
				perPage: 1,
				orderBy: "id_asc",
				q: "Pagination",
			});

		response.assertOk();
		response.assertBodyContains({
			meta: {
				currentPage: 2,
				perPage: 1,
				total: 3,
				firstPage: 1,
				lastPage: 3,
				hasMorePages: true,
			},
		});
		response.assertBodyContains({
			data: [{ id: secondAdmin.id }],
		});
	});

	test("it should filter admins using the search query", async ({ client, assert }) => {
		const currentAdmin = await AdminFactory.merge({
			name: "ControllerSearch Current",
			email: "controller.search.current@example.com",
		}).create();
		const matchingAdmin = await AdminFactory.merge({
			name: "ControllerSearchAlice",
			email: "controller.search.alice@example.com",
		}).create();
		await AdminFactory.merge({
			name: "ControllerSearchBob",
			email: "controller.search.bob@example.com",
		}).create();

		const response = await client
			.visit("admin.admins.list")
			.withGuard("admin")
			.loginAs(currentAdmin)
			.qs({ q: "ControllerSearchAlice" });

		response.assertOk();
		response.assertBodyContains({
			meta: {
				total: 1,
			},
		});
		assert.deepEqual(
			response.body().data.map((admin: { id: number }) => admin.id),
			[matchingAdmin.id],
		);
	});

	test("it should reject invalid pagination parameters", async ({ client }) => {
		const currentAdmin = await AdminFactory.create();

		const response = await client
			.visit("admin.admins.list")
			.withGuard("admin")
			.loginAs(currentAdmin)
			.qs({ page: 0, perPage: 1.5 });

		response.assertStatus(422);
	});

	test("it should reject unauthenticated requests", async ({ client }) => {
		const response = await client.visit("admin.admins.list");

		response.assertUnauthorized();
		response.assertBodyContains({
			code: "E_UNAUTHENTICATED",
		});
	});
});
