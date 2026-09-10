import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import UpdateRolePolicy from "#features/admin/roles/policies/update.policy";
import Role from "#models/role";
import User from "#models/user";

test.group("Features / Admin / Roles / Policies / Update Policy", () => {
	test("it should allow only an admin with the update role authorization", async ({ assert }) => {
		const policy = new UpdateRolePolicy();
		const admin = await AdminFactory.create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = [];
		await role.save();

		assert.isFalse(await policy.handle(admin));
		role.authorizations = ["update:role"];
		await role.save();
		assert.isTrue(await policy.handle(admin));
		assert.isFalse(await policy.handle(new User()));
	});
});
