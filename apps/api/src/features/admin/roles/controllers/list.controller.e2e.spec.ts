import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import { RoleFactory } from "#database/factories/role.factory";
import Role from "#models/role";

test.group("Features / Admin / Roles / Controllers / List Controller", () => {
	test("it should paginate, search, sort, and return action metadata", async ({
		client,
		assert,
	}) => {
		const admin = await AdminFactory.with("role").create();
		const adminRole = await Role.findOrFail(admin.roleId);
		adminRole.authorizations = [];
		await adminRole.save();
		const alpha = await RoleFactory.merge({ name: "Alpha Controller List" }).create();
		await RoleFactory.merge({ name: "Zulu Controller List" }).create();

		const response = await client
			.visit("admin.roles.list")
			.withGuard("admin")
			.loginAs(admin)
			.qs({ q: "Controller List", orderBy: "name_asc", perPage: 1 });

		response.assertOk();
		response.assertBodyContains({
			meta: { currentPage: 1, perPage: 1, total: 2, canCreate: false },
			data: [{ id: alpha.id, name: alpha.name }],
		});
		assert.deepEqual(response.body().data[0].meta, {
			canUpdate: false,
			canDelete: false,
		});
	});

	test("it should return immutable super-admin metadata to a super-admin", async ({ client }) => {
		const admin = await AdminFactory.with("role").create();
		const adminRole = await Role.findOrFail(admin.roleId);
		adminRole.isSuperAdmin = true;
		await adminRole.save();
		const role = await RoleFactory.merge({
			name: "Immutable Controller List",
			isSuperAdmin: true,
		}).create();

		const response = await client
			.visit("admin.roles.list")
			.withGuard("admin")
			.loginAs(admin)
			.qs({ q: "Immutable Controller List" });

		response.assertOk();
		response.assertBodyContains({
			meta: { total: 1, canCreate: true },
			data: [{ id: role.id, meta: { canUpdate: false, canDelete: false } }],
		});
	});

	test("it should reject unauthenticated requests", async ({ client }) => {
		const response = await client.visit("admin.roles.list");

		response.assertUnauthorized();
	});
});
