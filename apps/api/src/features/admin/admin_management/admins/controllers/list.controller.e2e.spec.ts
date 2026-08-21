import { test } from "@japa/runner";
import { DateTime } from "luxon";

import { AdminFactory } from "#database/factories/admin.factory";
import Admin from "#models/admin";

test.group("Features / Admin / Admin Management / Admins / Controllers / List Controller", () => {
	test("it should paginate every admin with the documented defaults", async ({
		client,
		assert,
	}) => {
		const authenticatedAdmin = await AdminFactory.create();
		await AdminFactory.createMany(21);

		const response = await client
			.visit("admin.admin_management.admins.list")
			.withGuard("admin")
			.loginAs(authenticatedAdmin);

		response.assertOk();
		response.assertBodyContains({
			meta: {
				total: 22,
				perPage: 20,
				currentPage: 1,
				firstPage: 1,
				lastPage: 2,
			},
		});
		assert.lengthOf(response.body().data, 20);
	});

	test("it should search names and emails case-insensitively", async ({ client, assert }) => {
		const authenticatedAdmin = await AdminFactory.create();
		const nameMatch = await AdminFactory.merge({
			name: "Alpha Manager",
			email: "unrelated@example.com",
		}).create();
		const emailMatch = await AdminFactory.merge({
			name: "Unrelated Manager",
			email: "alpha@example.com",
		}).create();
		await AdminFactory.merge({
			name: "Other Manager",
			email: "other@example.com",
		}).create();

		const response = await client
			.visit("admin.admin_management.admins.list")
			.withGuard("admin")
			.loginAs(authenticatedAdmin)
			.qs({ search: "  ALPHA  " });

		response.assertOk();
		assert.sameMembers(
			response.body().data.map((admin: { id: number }) => admin.id),
			[nameMatch.id, emailMatch.id],
		);
	});

	test("it should support every sort option with null activation dates last", async ({
		client,
		assert,
	}) => {
		const authenticatedAdmin = await AdminFactory.create();
		const first = await Admin.create({
			name: "Charlie",
			email: "sort.bravo@example.com",
			password: "password-one",
			activatedAt: DateTime.fromISO("2024-01-02T00:00:00Z"),
			createdAt: DateTime.fromISO("2024-01-03T00:00:00Z"),
			updatedAt: DateTime.fromISO("2024-01-01T00:00:00Z"),
		});
		const second = await Admin.create({
			name: "Alpha",
			email: "sort.charlie@example.com",
			password: "password-two",
			activatedAt: null,
			createdAt: DateTime.fromISO("2024-01-01T00:00:00Z"),
			updatedAt: DateTime.fromISO("2024-01-03T00:00:00Z"),
		});
		const third = await Admin.create({
			name: "Bravo",
			email: "sort.alpha@example.com",
			password: "password-three",
			activatedAt: DateTime.fromISO("2024-01-01T00:00:00Z"),
			createdAt: DateTime.fromISO("2024-01-02T00:00:00Z"),
			updatedAt: DateTime.fromISO("2024-01-02T00:00:00Z"),
		});

		const expectedOrders = {
			id_asc: [String(first.id), String(second.id), String(third.id)],
			id_desc: [String(third.id), String(second.id), String(first.id)],
			name_asc: [String(second.id), String(third.id), String(first.id)],
			name_desc: [String(first.id), String(third.id), String(second.id)],
			email_asc: [String(third.id), String(first.id), String(second.id)],
			email_desc: [String(second.id), String(first.id), String(third.id)],
			activatedAt_asc: [String(third.id), String(first.id), String(second.id)],
			activatedAt_desc: [String(first.id), String(third.id), String(second.id)],
			createdAt_asc: [String(second.id), String(third.id), String(first.id)],
			createdAt_desc: [String(first.id), String(third.id), String(second.id)],
			updatedAt_asc: [String(first.id), String(third.id), String(second.id)],
			updatedAt_desc: [String(second.id), String(third.id), String(first.id)],
		} as const;
		const targetIds = new Set([String(first.id), String(second.id), String(third.id)]);

		for (const sortBy of Object.keys(expectedOrders) as Array<keyof typeof expectedOrders>) {
			const expectedIds: readonly string[] = expectedOrders[sortBy];
			const response = await client
				.visit("admin.admin_management.admins.list")
				.withGuard("admin")
				.loginAs(authenticatedAdmin)
				.qs({ sortBy, perPage: 100 });

			response.assertOk();
			assert.deepEqual(
				response
					.body()
					.data.filter((admin: { id: number }) => targetIds.has(String(admin.id)))
					.map((admin: { id: number }) => String(admin.id)),
				expectedIds,
			);
		}
	});

	test("it should stabilize equal values using id in the same direction", async ({
		client,
		assert,
	}) => {
		const authenticatedAdmin = await AdminFactory.create();
		const first = await AdminFactory.merge({ name: "Same Name" }).create();
		const second = await AdminFactory.merge({ name: "Same Name" }).create();

		for (const [sortBy, expectedIds] of [
			["name_asc", [String(first.id), String(second.id)]],
			["name_desc", [String(second.id), String(first.id)]],
		] as const) {
			const expectedIdStrings: readonly string[] = expectedIds;
			const response = await client
				.visit("admin.admin_management.admins.list")
				.withGuard("admin")
				.loginAs(authenticatedAdmin)
				.qs({ sortBy, perPage: 100 });

			assert.deepEqual(
				response
					.body()
					.data.filter((admin: { id: number }) => expectedIdStrings.includes(String(admin.id)))
					.map((admin: { id: number }) => String(admin.id)),
				expectedIdStrings,
			);
		}
	});

	test("it should reject invalid pagination and sorting parameters", async ({ client }) => {
		const authenticatedAdmin = await AdminFactory.create();

		for (const query of ["page=0", "perPage=0", "sortBy=invalid"]) {
			const response = await client
				.get(`/admin/admin-management/admins?${query}`)
				.withGuard("admin")
				.loginAs(authenticatedAdmin);

			response.assertStatus(422);
		}
	});

	test("it should require admin authentication", async ({ client }) => {
		const response = await client.visit("admin.admin_management.admins.list");

		response.assertUnauthorized();
		response.assertBodyContains({
			code: "E_UNAUTHENTICATED",
		});
	});
});
