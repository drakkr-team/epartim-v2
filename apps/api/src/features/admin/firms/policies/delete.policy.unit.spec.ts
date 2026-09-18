import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import DeleteFirmPolicy from "#features/admin/firms/policies/delete.policy";
import Role from "#models/role";
import User from "#models/user";

test.group("Features / Admin / Firms / Policies / Delete Policy", () => {
	test("it should allow an authorized admin", async ({ assert }) => {
		const policy = new DeleteFirmPolicy();
		const admin = await AdminFactory.create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["delete:firm"];
		await role.save();

		assert.isTrue(await policy.handle(admin));
	});

	test("it should deny an unauthorized admin", async ({ assert }) => {
		const policy = new DeleteFirmPolicy();
		const admin = await AdminFactory.create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = [];
		await role.save();

		assert.isFalse(await policy.handle(admin));
	});

	test("it should deny a user", async ({ assert }) => {
		assert.isFalse(await new DeleteFirmPolicy().handle(new User()));
	});
});
