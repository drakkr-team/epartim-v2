import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import { RoleFactory } from "#database/factories/role.factory";
import DeleteRoleService from "#features/admin/roles/services/delete.service";
import Role from "#models/role";

test.group("Features / Admin / Roles / Services / Delete Service", () => {
	test("it should allow deleting a role without admins", async ({ assert }) => {
		const role = await RoleFactory.create();

		assert.isTrue(await new DeleteRoleService().canDelete(role.id));
	});

	test("it should deny deleting a role assigned to an admin", async ({ assert }) => {
		const admin = await AdminFactory.create();

		assert.isFalse(await new DeleteRoleService().canDelete(admin.roleId));
	});

	test("it should delete the role", async ({ assert }) => {
		const role = await RoleFactory.create();

		await new DeleteRoleService().handle(role.id);

		assert.isNull(await Role.find(role.id));
	});
});
