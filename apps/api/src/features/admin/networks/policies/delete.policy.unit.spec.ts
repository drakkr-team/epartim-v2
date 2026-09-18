import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import DeleteNetworkPolicy from "#features/admin/networks/policies/delete.policy";
import Role from "#models/role";
import User from "#models/user";

test.group("Features / Admin / Networks / Policies / Delete Policy", () => {
	test("it should allow an authorized admin", async ({ assert }) => {
		const policy = new DeleteNetworkPolicy();
		const admin = await AdminFactory.create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = ["delete:network"];
		await role.save();

		assert.isTrue(await policy.handle(admin));
	});

	test("it should deny an unauthorized admin", async ({ assert }) => {
		const policy = new DeleteNetworkPolicy();
		const admin = await AdminFactory.create();
		const role = await Role.findOrFail(admin.roleId);
		role.authorizations = [];
		await role.save();

		assert.isFalse(await policy.handle(admin));
	});

	test("it should deny a user", async ({ assert }) => {
		assert.isFalse(await new DeleteNetworkPolicy().handle(new User()));
	});
});
