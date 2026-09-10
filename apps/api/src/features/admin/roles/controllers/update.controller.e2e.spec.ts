import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import { RoleFactory } from "#database/factories/role.factory";
import Role from "#models/role";

test.group("Features / Admin / Roles / Controllers / Update Controller", () => {
	test("it should partially update and return a role", async ({ client, assert }) => {
		const admin = await AdminFactory.create();
		const role = await RoleFactory.merge({ name: "Update Role", authorizations: [] }).create();

		const response = await client
			.put(`/admin/roles/${role.id}`)
			.withGuard("admin")
			.loginAs(admin)
			.json({ authorizations: ["network:create"] });

		response.assertOk();
		response.assertBodyContains({
			id: role.id,
			name: "Update Role",
			authorizations: ["network:create"],
		});
		assert.deepEqual((await Role.findOrFail(role.id)).authorizations, ["network:create"]);
	});

	test("it should reject an invalid authorization", async ({ client }) => {
		const admin = await AdminFactory.create();
		const role = await RoleFactory.create();

		const response = await client
			.put(`/admin/roles/${role.id}`)
			.withGuard("admin")
			.loginAs(admin)
			.json({ authorizations: ["role:read"] });

		response.assertStatus(422);
	});
});
