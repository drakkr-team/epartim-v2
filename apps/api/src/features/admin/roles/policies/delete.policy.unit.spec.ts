import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import { RoleFactory } from "#database/factories/role.factory";
import DeleteRolePolicy from "#features/admin/roles/policies/delete.policy";
import DeleteRoleService from "#features/admin/roles/services/delete.service";
import Role from "#models/role";
import User from "#models/user";

test.group("Features / Admin / Roles / Policies / Delete Policy", () => {
	test("it should allow an authorized admin deleting an unused role", async ({ assert }) => {
		const policy = new DeleteRolePolicy(new DeleteRoleService());
		const admin = await AdminFactory.create();
		const adminRole = await Role.findOrFail(admin.roleId);
		adminRole.authorizations = [];
		await adminRole.save();
		const role = await RoleFactory.create();

		assert.isFalse(await policy.handle(admin, role.id));
		adminRole.authorizations = ["delete:role"];
		await adminRole.save();
		assert.isTrue(await policy.handle(admin, role.id));
		assert.isFalse(await policy.handle(new User(), role.id));
	});

	test("it should deny deleting a role assigned to an admin", async ({ assert }) => {
		const policy = new DeleteRolePolicy(new DeleteRoleService());
		const admin = await AdminFactory.create();
		const adminRole = await Role.findOrFail(admin.roleId);
		adminRole.authorizations = ["delete:role"];
		await adminRole.save();
		const role = await RoleFactory.create();
		const assignedAdmin = await AdminFactory.create();
		assignedAdmin.roleId = role.id;
		await assignedAdmin.save();

		assert.isFalse(await policy.handle(admin, role.id));
	});
});
