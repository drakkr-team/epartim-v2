import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import { RoleFactory } from "#database/factories/role.factory";
import Role from "#models/role";

test.group("Features / Admin / Roles / Controllers / Delete Controller", () => {
	test("it should delete an unused role", async ({ client, assert }) => {
		const admin = await AdminFactory.create();
		const role = await RoleFactory.create();

		const response = await client
			.visit("admin.roles.delete", { roleId: role.id })
			.withGuard("admin")
			.loginAs(admin);

		response.assertNoContent();
		assert.isNull(await Role.find(role.id));
	});

	test("it should return not found for an unknown roleId", async ({ client }) => {
		const admin = await AdminFactory.create();

		const response = await client
			.visit("admin.roles.delete", { roleId: 999_999 })
			.withGuard("admin")
			.loginAs(admin);

		response.assertNotFound();
	});
});
