import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import { UserFactory } from "#database/factories/user.factory";
import User from "#models/user";

test.group("Features / Admin / User Management / Users / Controllers / List Controller", () => {
	test("it should paginate every user with the documented defaults", async ({ client, assert }) => {
		const existingUserCount = (await User.all()).length;
		const authenticatedAdmin = await AdminFactory.create();
		await UserFactory.createMany(21);
		const expectedTotal = existingUserCount + 21;

		const response = await client
			.visit("admin.user_management.users.list")
			.withGuard("admin")
			.loginAs(authenticatedAdmin);

		response.assertOk();
		response.assertBodyContains({
			meta: {
				total: expectedTotal,
				perPage: 20,
				currentPage: 1,
				firstPage: 1,
				lastPage: Math.ceil(expectedTotal / 20),
			},
		});
		assert.lengthOf(response.body().data, 20);
	});

	test("it should search names and emails case-insensitively", async ({ client, assert }) => {
		const authenticatedAdmin = await AdminFactory.create();
		const firstNameMatch = await UserFactory.merge({
			firstName: "Alpha",
			lastName: "Manager",
			email: "unrelated@example.com",
		}).create();
		const lastNameMatch = await UserFactory.merge({
			firstName: "Unrelated",
			lastName: "Alpha",
			email: "another@example.com",
		}).create();
		const emailMatch = await UserFactory.merge({
			firstName: "Unrelated",
			lastName: "User",
			email: "alpha@example.com",
		}).create();

		const response = await client
			.visit("admin.user_management.users.list")
			.withGuard("admin")
			.loginAs(authenticatedAdmin)
			.qs({ search: "  ALPHA  ", perPage: 100 });

		response.assertOk();
		assert.sameMembers(
			response.body().data.map((user: { id: number }) => user.id),
			[firstNameMatch.id, lastNameMatch.id, emailMatch.id],
		);
	});

	test("it should support sorting and stabilize equal values using the identifier", async ({
		client,
		assert,
	}) => {
		const authenticatedAdmin = await AdminFactory.create();
		const first = await UserFactory.merge({ firstName: "Same", lastName: "Alpha" }).create();
		const second = await UserFactory.merge({ firstName: "Same", lastName: "Bravo" }).create();
		const targetIds = [String(first.id), String(second.id)];

		for (const [sortBy, expectedIds] of [
			["firstName_asc", targetIds],
			["firstName_desc", [...targetIds].reverse()],
		] as const) {
			const response = await client
				.visit("admin.user_management.users.list")
				.withGuard("admin")
				.loginAs(authenticatedAdmin)
				.qs({ sortBy, perPage: 100 });

			assert.deepEqual(
				response
					.body()
					.data.filter((user: { id: number }) => targetIds.includes(String(user.id)))
					.map((user: { id: number }) => String(user.id)),
				expectedIds,
			);
		}
	});

	test("it should reject invalid pagination and sorting parameters", async ({ client }) => {
		const authenticatedAdmin = await AdminFactory.create();

		for (const query of ["page=0", "perPage=0", "sortBy=invalid"]) {
			const response = await client
				.get(`/admin/user-management/users?${query}`)
				.withGuard("admin")
				.loginAs(authenticatedAdmin);

			response.assertStatus(422);
		}
	});

	test("it should require admin authentication", async ({ client }) => {
		const response = await client.visit("admin.user_management.users.list");

		response.assertUnauthorized();
		response.assertBodyContains({
			code: "E_UNAUTHENTICATED",
		});
	});
});
