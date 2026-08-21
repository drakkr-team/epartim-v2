import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";

test.group(
	"Features / Admin / Admin Management / Authentication / Controllers / Logout Controller",
	() => {
		test("it should logout the admin successfully", async ({ client }) => {
			const admin = await AdminFactory.create();

			const response = await client
				.visit("admin.account_management.authentication.logout")
				.withGuard("admin")
				.loginAs(admin);

			response.assertNoContent();
		});

		test("it should respond with E_UNAUTHENTICATED code if not authenticated", async ({
			client,
		}) => {
			const response = await client.visit("admin.account_management.authentication.logout");

			response.assertUnauthorized();
			response.assertBodyContains({
				code: "E_UNAUTHENTICATED",
			});
		});
	},
);
