import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import DeleteAdminPolicy from "#features/admin/admins/policies/delete.policy";
import Role from "#models/role";
import User from "#models/user";

test.group("Features / Admin / Admins / Policies / Delete Policy", () => {
	test("it should allow an authorized admin to delete another admin", async ({ assert }) => {
		const policy = new DeleteAdminPolicy();
		const currentAdmin = await AdminFactory.create();
		const role = await Role.findOrFail(currentAdmin.roleId);
		role.authorizations = ["delete:admin"];
		await role.save();

		const canDelete = await policy.handle(currentAdmin, currentAdmin.id + 1);

		assert.isTrue(canDelete);
	});

	test("it should deny an authorized admin deleting itself", async ({ assert }) => {
		const policy = new DeleteAdminPolicy();
		const currentAdmin = await AdminFactory.create();
		const role = await Role.findOrFail(currentAdmin.roleId);
		role.authorizations = ["delete:admin"];
		await role.save();

		const canDelete = await policy.handle(currentAdmin, currentAdmin.id);

		assert.isFalse(canDelete);
	});

	test("it should deny an admin without the delete admin authorization", async ({ assert }) => {
		const policy = new DeleteAdminPolicy();
		const currentAdmin = await AdminFactory.create();
		const role = await Role.findOrFail(currentAdmin.roleId);
		role.authorizations = [];
		await role.save();

		const canDelete = await policy.handle(currentAdmin, currentAdmin.id + 1);

		assert.isFalse(canDelete);
	});

	test("it should deny a user", async ({ assert }) => {
		assert.isFalse(await new DeleteAdminPolicy().handle(new User(), 1));
	});
});
