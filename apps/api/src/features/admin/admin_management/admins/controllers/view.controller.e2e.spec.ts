import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";

test.group("Features / Admin / Admin Management / Admins / Controllers / View Controller", () => {
	test("it should return an administrator without the password", async ({ client, assert }) => {
		const authenticatedAdmin = await AdminFactory.create();
		const targetAdmin = await AdminFactory.create();

		const response = await client
			.visit("admin.admin_management.admins.view", { id: targetAdmin.id })
			.withGuard("admin")
			.loginAs(authenticatedAdmin);

		response.assertOk();
		response.assertBodyContains({
			id: targetAdmin.id,
			name: targetAdmin.name,
			email: targetAdmin.email,
		});
		assert.notProperty(response.body(), "password");
	});

	test("it should allow an administrator to view their own account", async ({ client }) => {
		const authenticatedAdmin = await AdminFactory.create();

		const response = await client
			.visit("admin.admin_management.admins.view", { id: authenticatedAdmin.id })
			.withGuard("admin")
			.loginAs(authenticatedAdmin);

		response.assertOk();
		response.assertBodyContains({
			id: authenticatedAdmin.id,
		});
	});

	test("it should return not found for missing and invalid identifiers", async ({ client }) => {
		const authenticatedAdmin = await AdminFactory.create();

		for (const id of ["999999", "invalid", "0", "-1"]) {
			const response = await client
				.get(`/admin/admin-management/admins/${id}`)
				.withGuard("admin")
				.loginAs(authenticatedAdmin);

			response.assertNotFound();
		}
	});

	test("it should require admin authentication", async ({ client }) => {
		const targetAdmin = await AdminFactory.create();
		const response = await client.visit("admin.admin_management.admins.view", {
			id: targetAdmin.id,
		});

		response.assertUnauthorized();
		response.assertBodyContains({
			code: "E_UNAUTHENTICATED",
		});
	});
});
