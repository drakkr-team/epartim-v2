import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import Role from "#models/role";

test.group("Features / Admin / Roles / Controllers / Create Controller", () => {
	test("it should create and return a role", async ({ client, assert }) => {
		const admin = await AdminFactory.create();
		const adminRole = await Role.findOrFail(admin.roleId);
		adminRole.authorizations = ["create:role"];
		await adminRole.save();

		const response = await client
			.visit("admin.roles.create")
			.withGuard("admin")
			.loginAs(admin)
			.json({
				name: "Support",
				authorizations: ["create:user", "update:firm"],
			});

		response.assertCreated();
		response.assertBodyContains({
			name: "Support",
			isSuperAdmin: false,
			authorizations: ["create:user", "update:firm"],
		});

		const role = await Role.findByOrFail("name", "Support");
		assert.deepEqual(role.authorizations, ["create:user", "update:firm"]);
	});

	test("it should forbid an admin without the create role authorization", async ({ client }) => {
		const admin = await AdminFactory.create();
		const adminRole = await Role.findOrFail(admin.roleId);
		adminRole.authorizations = [];
		await adminRole.save();

		const response = await client
			.visit("admin.roles.create")
			.withGuard("admin")
			.loginAs(admin)
			.json({ name: "Support", authorizations: [] });

		response.assertForbidden();
	});

	test("it should reject invalid authorizations and duplicate names", async ({ client }) => {
		const admin = await AdminFactory.create();
		const adminRole = await Role.findOrFail(admin.roleId);
		adminRole.authorizations = ["create:role"];
		await adminRole.save();
		await Role.create({ name: "Duplicate Role", authorizations: [] });

		const invalidAuthorization = await client
			.post("/admin/roles")
			.withGuard("admin")
			.loginAs(admin)
			.json({ name: "Operations", authorizations: ["role:read"] });
		invalidAuthorization.assertStatus(422);

		const duplicateName = await client
			.visit("admin.roles.create")
			.withGuard("admin")
			.loginAs(admin)
			.json({ name: "Duplicate Role", authorizations: [] });
		duplicateName.assertStatus(422);
	});

	test("it should reject unauthenticated requests", async ({ client }) => {
		const response = await client
			.visit("admin.roles.create")
			.json({ name: "Support", authorizations: [] });

		response.assertUnauthorized();
	});
});
