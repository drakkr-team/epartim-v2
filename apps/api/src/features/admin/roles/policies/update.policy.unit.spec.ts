import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import { RoleFactory } from "#database/factories/role.factory";
import UpdateRolePolicy from "#features/admin/roles/policies/update.policy";
import Role from "#models/role";
import User from "#models/user";

test.group("Features / Admin / Roles / Policies / Update Policy", () => {
	test("it should allow only a super-admin to update custom roles", async ({ assert }) => {
		const policy = new UpdateRolePolicy();
		const admin = await AdminFactory.create();
		const role = await Role.findOrFail(admin.roleId);
		const targetRole = await RoleFactory.create();
		role.authorizations = [];
		await role.save();

		assert.isFalse(await policy.handle(admin, targetRole));
		role.authorizations = ["update:role"];
		await role.save();
		assert.isFalse(await policy.handle(admin, targetRole));
		role.isSuperAdmin = true;
		await role.save();
		assert.isTrue(await policy.handle(admin, targetRole));
		assert.isFalse(await policy.handle(new User(), targetRole));
	});

	test("it should forbid updating the super-admin role", async ({ assert }) => {
		const policy = new UpdateRolePolicy();
		const admin = await AdminFactory.create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["update:role"];
		role.isSuperAdmin = true;
		await role.save();
		const targetRole = await RoleFactory.merge({ isSuperAdmin: true }).create();

		assert.isFalse(await policy.handle(admin, targetRole));
	});
});
