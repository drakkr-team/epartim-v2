import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import { RoleFactory } from "#database/factories/role.factory";
import Role from "#models/role";

test.group("Features / Admin / Roles / Controllers / View Controller", () => {
	test("it should return a role and action metadata", async ({ client }) => {
		const admin = await AdminFactory.create();
		const adminRole = await Role.findOrFail(admin.roleId);
		adminRole.authorizations = [];
		await adminRole.save();
		const role = await RoleFactory.merge({ name: "View Role" }).create();

		const response = await client
			.visit("admin.roles.view", { roleId: role.id })
			.withGuard("admin")
			.loginAs(admin);

		response.assertOk();
		response.assertBodyContains({
			id: role.id,
			name: "View Role",
			meta: { canUpdate: false, canDelete: false },
		});
	});

	test("it should return not found for an unknown roleId", async ({ client }) => {
		const admin = await AdminFactory.create();

		const response = await client
			.visit("admin.roles.view", { roleId: 999_999 })
			.withGuard("admin")
			.loginAs(admin);

		response.assertNotFound();
	});
});
