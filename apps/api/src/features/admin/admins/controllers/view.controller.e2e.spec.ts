import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";

test.group("Features / Admin / Admins / Controllers / View Controller", () => {
	test("it should return another admin with authorization metadata", async ({ client }) => {
		const currentAdmin = await AdminFactory.create();
		const viewedAdmin = await AdminFactory.create();

		const response = await client
			.visit("admin.admins.view", { adminId: viewedAdmin.id })
			.withGuard("admin")
			.loginAs(currentAdmin);

		response.assertOk();
		response.assertBodyContains({
			id: viewedAdmin.id,
			name: viewedAdmin.name,
			email: viewedAdmin.email,
			meta: {
				canUpdate: true,
				canDelete: true,
			},
		});
	});

	test("it should indicate that an admin cannot delete itself", async ({ client }) => {
		const currentAdmin = await AdminFactory.create();

		const response = await client
			.visit("admin.admins.view", { adminId: currentAdmin.id })
			.withGuard("admin")
			.loginAs(currentAdmin);

		response.assertOk();
		response.assertBodyContains({
			id: currentAdmin.id,
			meta: {
				canUpdate: true,
				canDelete: false,
			},
		});
	});

	test("it should return not found for a missing admin", async ({ client }) => {
		const currentAdmin = await AdminFactory.create();

		const response = await client
			.visit("admin.admins.view", { adminId: 999_999 })
			.withGuard("admin")
			.loginAs(currentAdmin);

		response.assertNotFound();
	});

	test("it should reject unauthenticated requests", async ({ client }) => {
		const response = await client.visit("admin.admins.view", { adminId: 1 });

		response.assertUnauthorized();
		response.assertBodyContains({
			code: "E_UNAUTHENTICATED",
		});
	});
});
