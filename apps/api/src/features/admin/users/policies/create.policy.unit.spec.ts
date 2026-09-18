import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import CreateUserPolicy from "#features/admin/users/policies/create.policy";
import Role from "#models/role";
import User from "#models/user";

test.group("Features / Admin / Users / Policies / Create Policy", () => {
	test("it should allow an authorized admin", async ({ assert }) => {
		const policy = new CreateUserPolicy();
		const admin = await AdminFactory.create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["create:user"];
		await role.save();

		const canCreate = await policy.handle(admin);

		assert.isTrue(canCreate);
	});

	test("it should deny an unauthorized admin", async ({ assert }) => {
		const policy = new CreateUserPolicy();
		const admin = await AdminFactory.create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = [];
		await role.save();

		const canCreate = await policy.handle(admin);

		assert.isFalse(canCreate);
	});

	test("it should deny a user", async ({ assert }) => {
		assert.isFalse(await new CreateUserPolicy().handle(new User()));
	});
});
