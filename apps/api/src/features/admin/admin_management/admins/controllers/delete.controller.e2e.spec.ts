import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import Admin from "#models/admin";

test.group("Features / Admin / Admin Management / Admins / Controllers / Delete Controller", () => {
	test("it should permanently delete another administrator", async ({ client, assert }) => {
		const authenticatedAdmin = await AdminFactory.create();
		const targetAdmin = await AdminFactory.create();

		const response = await client
			.visit("admin.admin_management.admins.delete", { id: targetAdmin.id })
			.withGuard("admin")
			.loginAs(authenticatedAdmin);

		response.assertNoContent();
		assert.isNull(await Admin.find(targetAdmin.id));
	});

	test("it should forbid deleting the authenticated administrator", async ({ client, assert }) => {
		const authenticatedAdmin = await AdminFactory.create();

		const response = await client
			.visit("admin.admin_management.admins.delete", { id: authenticatedAdmin.id })
			.withGuard("admin")
			.loginAs(authenticatedAdmin);

		response.assertForbidden();
		response.assertBodyContains({
			code: "E_CANNOT_DELETE_SELF",
			message: "You cannot delete your own admin account.",
		});
		assert.isNotNull(await Admin.find(authenticatedAdmin.id));
	});

	test("it should return not found for missing and invalid identifiers", async ({ client }) => {
		const authenticatedAdmin = await AdminFactory.create();

		for (const id of ["999999", "invalid", "0", "-1"]) {
			const response = await client
				.delete(`/admin/admin-management/admins/${id}`)
				.withGuard("admin")
				.loginAs(authenticatedAdmin);

			response.assertNotFound();
		}
	});

	test("it should require admin authentication", async ({ client }) => {
		const targetAdmin = await AdminFactory.create();
		const response = await client.visit("admin.admin_management.admins.delete", {
			id: targetAdmin.id,
		});

		response.assertUnauthorized();
		response.assertBodyContains({
			code: "E_UNAUTHENTICATED",
		});
	});
});
