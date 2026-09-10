import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import UpdateAdminPolicy from "#features/admin/admins/policies/update.policy";
import Role from "#models/role";
import User from "#models/user";

test.group("Features / Admin / Admins / Policies / Update Policy", () => {
	test("it should allow an admin with the update admin authorization", async ({ assert }) => {
		const policy = new UpdateAdminPolicy();
		const admin = await AdminFactory.create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["update:admin"];
		await role.save();

		const canUpdate = await policy.handle(admin);

		assert.isTrue(canUpdate);
	});

	test("it should deny an admin without the update admin authorization", async ({ assert }) => {
		const policy = new UpdateAdminPolicy();
		const admin = await AdminFactory.create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = [];
		await role.save();

		const canUpdate = await policy.handle(admin);

		assert.isFalse(canUpdate);
	});

	test("it should deny a user", async ({ assert }) => {
		assert.isFalse(await new UpdateAdminPolicy().handle(new User()));
	});
});
