import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import CreateAdminPolicy from "#features/admin/admins/policies/create.policy";
import Role from "#models/role";
import User from "#models/user";

test.group("Features / Admin / Admins / Policies / Create Policy", () => {
	test("it should allow an admin with the create admin authorization", async ({ assert }) => {
		const policy = new CreateAdminPolicy();
		const admin = await AdminFactory.create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["create:admin"];
		await role.save();

		const canCreate = await policy.handle(admin);

		assert.isTrue(canCreate);
	});

	test("it should deny an admin without the create admin authorization", async ({ assert }) => {
		const policy = new CreateAdminPolicy();
		const admin = await AdminFactory.create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = [];
		await role.save();

		const canCreate = await policy.handle(admin);

		assert.isFalse(canCreate);
	});

	test("it should deny a user", async ({ assert }) => {
		assert.isFalse(await new CreateAdminPolicy().handle(new User()));
	});
});
