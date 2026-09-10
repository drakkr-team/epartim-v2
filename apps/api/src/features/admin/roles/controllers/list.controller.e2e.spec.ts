import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import { RoleFactory } from "#database/factories/role.factory";

test.group("Features / Admin / Roles / Controllers / List Controller", () => {
	test("it should paginate, search, sort, and return action metadata", async ({
		client,
		assert,
	}) => {
		const admin = await AdminFactory.create();
		const alpha = await RoleFactory.merge({ name: "Alpha Controller List" }).create();
		await RoleFactory.merge({ name: "Zulu Controller List" }).create();

		const response = await client
			.visit("admin.roles.list")
			.withGuard("admin")
			.loginAs(admin)
			.qs({ q: "Controller List", orderBy: "name_asc", perPage: 1 });

		response.assertOk();
		response.assertBodyContains({
			meta: { currentPage: 1, perPage: 1, total: 2, canCreate: true },
			data: [{ id: alpha.id, name: alpha.name }],
		});
		assert.deepEqual(response.body().data[0].meta, {
			canUpdate: true,
			canDelete: true,
		});
	});

	test("it should reject unauthenticated requests", async ({ client }) => {
		const response = await client.visit("admin.roles.list");

		response.assertUnauthorized();
	});
});
