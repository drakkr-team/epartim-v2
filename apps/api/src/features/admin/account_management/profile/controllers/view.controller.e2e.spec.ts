import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";

test.group("Features / Admin / Admin Management / Profile / Controllers / View Controller", () => {
	test("it should return the authenticated admin profile", async ({ client }) => {
		const admin = await AdminFactory.create();

		const response = await client
			.visit("admin.account_management.profile.view")
			.withGuard("admin")
			.loginAs(admin);

		response.assertOk();
		response.assertBodyContains({
			id: admin.id,
			name: admin.name,
			email: admin.email,
		});
	});

	test("it should respond with E_UNAUTHENTICATED when the admin is not authenticated", async ({
		client,
	}) => {
		const response = await client.visit("admin.account_management.profile.view");

		response.assertUnauthorized();
		response.assertBodyContains({
			code: "E_UNAUTHENTICATED",
		});
	});
});
