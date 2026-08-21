import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import Admin from "#models/admin";

test.group("Features / Admin / Admins / Controllers / Update Controller", () => {
	test("it should update and return an admin", async ({ client, assert }) => {
		const currentAdmin = await AdminFactory.create();
		const updatedAdmin = await AdminFactory.create();

		const response = await client
			.visit("admin.admins.update", { adminId: updatedAdmin.id })
			.withGuard("admin")
			.loginAs(currentAdmin)
			.json({
				name: "Updated Admin",
			});

		response.assertOk();
		response.assertBodyContains({
			id: updatedAdmin.id,
			name: "Updated Admin",
			email: updatedAdmin.email,
		});

		const persistedAdmin = await Admin.findOrFail(updatedAdmin.id);
		assert.equal(persistedAdmin.name, "Updated Admin");
	});

	test("it should trim the updated admin name", async ({ client }) => {
		const currentAdmin = await AdminFactory.create();
		const updatedAdmin = await AdminFactory.create();

		const response = await client
			.visit("admin.admins.update", { adminId: updatedAdmin.id })
			.withGuard("admin")
			.loginAs(currentAdmin)
			.json({
				name: "  Updated Admin  ",
			});

		response.assertOk();
		response.assertBodyContains({
			name: "Updated Admin",
		});
	});

	test("it should reject an invalid name", async ({ client }) => {
		const currentAdmin = await AdminFactory.create();
		const updatedAdmin = await AdminFactory.create();

		const response = await client
			.visit("admin.admins.update", { adminId: updatedAdmin.id })
			.withGuard("admin")
			.loginAs(currentAdmin)
			.json({
				name: "",
			});

		response.assertStatus(422);
	});

	test("it should return not found for a missing admin", async ({ client }) => {
		const currentAdmin = await AdminFactory.create();

		const response = await client
			.visit("admin.admins.update", { adminId: 999_999 })
			.withGuard("admin")
			.loginAs(currentAdmin)
			.json({
				name: "Updated Admin",
			});

		response.assertNotFound();
	});

	test("it should reject unauthenticated requests", async ({ client }) => {
		const response = await client.visit("admin.admins.update", { adminId: 1 }).json({
			name: "Updated Admin",
		});

		response.assertUnauthorized();
		response.assertBodyContains({
			code: "E_UNAUTHENTICATED",
		});
	});
});
