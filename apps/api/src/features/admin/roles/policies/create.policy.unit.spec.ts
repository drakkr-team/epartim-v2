import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import CreateRolePolicy from "#features/admin/roles/policies/create.policy";
import Role from "#models/role";
import User from "#models/user";

test.group("Features / Admin / Roles / Policies / Create Policy", () => {
	test("it should allow only an admin with the create role authorization", async ({ assert }) => {
		const policy = new CreateRolePolicy();
		const admin = await AdminFactory.create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = [];
		await role.save();

		assert.isFalse(await policy.handle(admin));
		role.authorizations = ["create:role"];
		await role.save();
		assert.isTrue(await policy.handle(admin));
		assert.isFalse(await policy.handle(new User()));
	});
});
