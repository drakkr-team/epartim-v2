import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import DeleteUserPolicy from "#features/admin/users/policies/delete.policy";
import Role from "#models/role";
import User from "#models/user";

test.group("Features / Admin / Users / Policies / Delete Policy", () => {
	test("it should allow an authorized admin to delete a user", async ({ assert }) => {
		const policy = new DeleteUserPolicy();
		const admin = await AdminFactory.create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["delete:user"];
		await role.save();

		const canDelete = await policy.handle(admin, 1);

		assert.isTrue(canDelete);
	});

	test("it should deny an unauthorized admin", async ({ assert }) => {
		const policy = new DeleteUserPolicy();
		const admin = await AdminFactory.create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = [];
		await role.save();

		const canDelete = await policy.handle(admin, 1);

		assert.isFalse(canDelete);
	});

	test("it should deny a user", async ({ assert }) => {
		assert.isFalse(await new DeleteUserPolicy().handle(new User(), 1));
	});
});
