import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";

test.group("Features / Admin / Admins / Controllers / Delete Controller", () => {
	test("it should delete another admin", async ({ client }) => {
		const currentAdmin = await AdminFactory.create();
		const deletedAdmin = await AdminFactory.create();

		const response = await client
			.visit("admin.admins.delete", { adminId: deletedAdmin.id })
			.withGuard("admin")
			.loginAs(currentAdmin);

		response.assertNoContent();
	});

	test("it should forbid an admin from deleting itself", async ({ client }) => {
		const currentAdmin = await AdminFactory.create();

		const response = await client
			.visit("admin.admins.delete", { adminId: currentAdmin.id })
			.withGuard("admin")
			.loginAs(currentAdmin);

		response.assertForbidden();
	});

	test("it should return not found for a missing admin", async ({ client }) => {
		const currentAdmin = await AdminFactory.create();

		const response = await client
			.visit("admin.admins.delete", { adminId: 999_999 })
			.withGuard("admin")
			.loginAs(currentAdmin);

		response.assertNotFound();
	});

	test("it should reject unauthenticated requests", async ({ client }) => {
		const response = await client.visit("admin.admins.delete", { adminId: 1 });

		response.assertUnauthorized();
		response.assertBodyContains({
			code: "E_UNAUTHENTICATED",
		});
	});
});
