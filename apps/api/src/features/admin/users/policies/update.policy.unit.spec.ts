import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import UpdateUserPolicy from "#features/admin/users/policies/update.policy";
import Role from "#models/role";
import User from "#models/user";

test.group("Features / Admin / Users / Policies / Update Policy", () => {
	test("it should allow an authorized admin", async ({ assert }) => {
		const policy = new UpdateUserPolicy();
		const admin = await AdminFactory.create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["update:user"];
		await role.save();

		const canUpdate = await policy.handle(admin);

		assert.isTrue(canUpdate);
	});

	test("it should deny an unauthorized admin", async ({ assert }) => {
		const policy = new UpdateUserPolicy();
		const admin = await AdminFactory.create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = [];
		await role.save();

		const canUpdate = await policy.handle(admin);

		assert.isFalse(canUpdate);
	});

	test("it should deny a user", async ({ assert }) => {
		assert.isFalse(await new UpdateUserPolicy().handle(new User()));
	});
});
