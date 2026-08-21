import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import Admin from "#models/admin";

test.group("Features / Admin / Admins / Controllers / Create Controller", () => {
	test("it should create and return an admin", async ({ client, assert }) => {
		const currentAdmin = await AdminFactory.create();

		const response = await client
			.visit("admin.admins.create")
			.withGuard("admin")
			.loginAs(currentAdmin)
			.json({
				name: "New Admin",
				email: "new.admin@example.com",
			});

		response.assertCreated();
		response.assertBodyContains({
			name: "New Admin",
			email: "new.admin@example.com",
		});
		assert.notProperty(response.body(), "password");

		const createdAdmin = await Admin.findByOrFail("email", "new.admin@example.com");
		assert.equal(createdAdmin.name, "New Admin");
		assert.isNotEmpty(createdAdmin.password);
	});

	test("it should trim the admin name and email", async ({ client }) => {
		const currentAdmin = await AdminFactory.create();

		const response = await client
			.visit("admin.admins.create")
			.withGuard("admin")
			.loginAs(currentAdmin)
			.json({
				name: "  New Admin  ",
				email: "  trimmed.admin@example.com  ",
			});

		response.assertCreated();
		response.assertBodyContains({
			name: "New Admin",
			email: "trimmed.admin@example.com",
		});
	});

	test("it should reject invalid input", async ({ client }) => {
		const currentAdmin = await AdminFactory.create();

		const response = await client
			.visit("admin.admins.create")
			.withGuard("admin")
			.loginAs(currentAdmin)
			.json({
				name: "",
				email: "invalid-email",
			});

		response.assertStatus(422);
	});

	test("it should reject an email already used by another admin", async ({ client }) => {
		const currentAdmin = await AdminFactory.create();
		const existingAdmin = await AdminFactory.create();

		const response = await client
			.visit("admin.admins.create")
			.withGuard("admin")
			.loginAs(currentAdmin)
			.json({
				name: "Duplicate Admin",
				email: existingAdmin.email,
			});

		response.assertStatus(422);
	});

	test("it should reject unauthenticated requests", async ({ client }) => {
		const response = await client.visit("admin.admins.create").json({
			name: "New Admin",
			email: "new.admin@example.com",
		});

		response.assertUnauthorized();
		response.assertBodyContains({
			code: "E_UNAUTHENTICATED",
		});
	});
});
