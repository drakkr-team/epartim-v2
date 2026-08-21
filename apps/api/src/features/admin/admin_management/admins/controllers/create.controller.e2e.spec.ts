import hash from "@adonisjs/core/services/hash";
import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import Admin from "#models/admin";

test.group("Features / Admin / Admin Management / Admins / Controllers / Create Controller", () => {
	test("it should create an inactive admin with normalized fields", async ({ client, assert }) => {
		const authenticatedAdmin = await AdminFactory.create();
		const payload = {
			name: "  Élodie 管理者  ",
			email: "  NEW.ADMIN@EXAMPLE.COM  ",
			password: "provided-password",
			activatedAt: new Date().toISOString(),
			role: "super-admin",
		};

		const response = await client
			.post("/admin/admin-management/admins")
			.withGuard("admin")
			.loginAs(authenticatedAdmin)
			.json(payload as Pick<typeof payload, "name" | "email">);

		response.assertCreated();
		response.assertBodyContains({
			name: "Élodie 管理者",
			email: "new.admin@example.com",
			activatedAt: null,
		});
		assert.notProperty(response.body(), "password");

		const createdAdmin = await Admin.findByOrFail("email", "new.admin@example.com");
		assert.isNull(createdAdmin.activatedAt);
		assert.isFalse(await hash.verify(createdAdmin.password, "provided-password"));
	});

	test("it should reject an email already used by an admin", async ({ client }) => {
		const authenticatedAdmin = await AdminFactory.create();
		const existingAdmin = await AdminFactory.merge({ email: "existing@example.com" }).create();

		const response = await client
			.visit("admin.admin_management.admins.create")
			.withGuard("admin")
			.loginAs(authenticatedAdmin)
			.json({
				name: "Another Admin",
				email: `  ${existingAdmin.email.toUpperCase()}  `,
			});

		response.assertStatus(409);
		response.assertBodyContains({
			code: "E_EMAIL_ALREADY_EXISTS",
		});
	});

	test("it should reject invalid payloads", async ({ client }) => {
		const authenticatedAdmin = await AdminFactory.create();

		const response = await client
			.visit("admin.admin_management.admins.create")
			.withGuard("admin")
			.loginAs(authenticatedAdmin)
			.json({
				name: " ",
				email: "invalid-email",
			});

		response.assertStatus(422);
	});

	test("it should require admin authentication", async ({ client }) => {
		const response = await client.visit("admin.admin_management.admins.create").json({
			name: "New Admin",
			email: "new.admin@example.com",
		});

		response.assertUnauthorized();
		response.assertBodyContains({
			code: "E_UNAUTHENTICATED",
		});
	});
});
