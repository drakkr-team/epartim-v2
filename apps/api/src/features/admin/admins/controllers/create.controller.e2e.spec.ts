import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import { RoleFactory } from "#database/factories/role.factory";
import Admin from "#models/admin";
import Role from "#models/role";

test.group("Features / Admin / Admins / Controllers / Create Controller", () => {
	test("it should create and return an admin", async ({ client, assert }) => {
		const currentAdmin = await AdminFactory.create();
		const currentRole = await Role.findOrFail(currentAdmin.roleId);
		currentRole.authorizations = ["create:admin"];
		await currentRole.save();
		const role = await RoleFactory.create();

		const response = await client
			.visit("admin.admins.create")
			.withGuard("admin")
			.loginAs(currentAdmin)
			.json({
				name: "New Admin",
				email: "new.admin@example.com",
				roleId: role.id,
			});

		response.assertCreated();
		response.assertBodyContains({
			name: "New Admin",
			email: "new.admin@example.com",
			roleId: role.id,
		});
		assert.notProperty(response.body(), "password");

		const createdAdmin = await Admin.findByOrFail("email", "new.admin@example.com");
		assert.equal(createdAdmin.name, "New Admin");
		assert.equal(createdAdmin.roleId, role.id);
		assert.isNotEmpty(createdAdmin.password);
	});

	test("it should trim the admin name and email", async ({ client }) => {
		const currentAdmin = await AdminFactory.create();
		const currentRole = await Role.findOrFail(currentAdmin.roleId);
		currentRole.authorizations = ["create:admin"];
		await currentRole.save();
		const role = await RoleFactory.create();

		const response = await client
			.visit("admin.admins.create")
			.withGuard("admin")
			.loginAs(currentAdmin)
			.json({
				name: "  New Admin  ",
				email: "  trimmed.admin@example.com  ",
				roleId: role.id,
			});

		response.assertCreated();
		response.assertBodyContains({
			name: "New Admin",
			email: "trimmed.admin@example.com",
			roleId: role.id,
		});
	});

	test("it should reject a missing role", async ({ client }) => {
		const currentAdmin = await AdminFactory.create();
		const currentRole = await Role.findOrFail(currentAdmin.roleId);
		currentRole.authorizations = ["create:admin"];
		await currentRole.save();

		const response = await client
			.visit("admin.admins.create")
			.withGuard("admin")
			.loginAs(currentAdmin)
			.json({
				name: "Unknown Role Admin",
				email: "unknown.role.admin@example.com",
				roleId: 2_147_483_647,
			});

		response.assertStatus(422);
	});

	test("it should reject invalid input", async ({ client }) => {
		const currentAdmin = await AdminFactory.create();
		const currentRole = await Role.findOrFail(currentAdmin.roleId);
		currentRole.authorizations = ["create:admin"];
		await currentRole.save();

		const response = await client
			.visit("admin.admins.create")
			.withGuard("admin")
			.loginAs(currentAdmin)
			.json({
				name: "",
				email: "invalid-email",
				roleId: currentAdmin.roleId,
			});

		response.assertStatus(422);
	});

	test("it should reject an email already used by another admin", async ({ client }) => {
		const currentAdmin = await AdminFactory.create();
		const currentRole = await Role.findOrFail(currentAdmin.roleId);
		currentRole.authorizations = ["create:admin"];
		await currentRole.save();
		const existingAdmin = await AdminFactory.create();

		const response = await client
			.visit("admin.admins.create")
			.withGuard("admin")
			.loginAs(currentAdmin)
			.json({
				name: "Duplicate Admin",
				email: existingAdmin.email,
				roleId: currentAdmin.roleId,
			});

		response.assertStatus(422);
	});

	test("it should reject unauthenticated requests", async ({ client }) => {
		const response = await client.visit("admin.admins.create").json({
			name: "New Admin",
			email: "new.admin@example.com",
			roleId: 1,
		});

		response.assertUnauthorized();
		response.assertBodyContains({
			code: "E_UNAUTHENTICATED",
		});
	});
});
