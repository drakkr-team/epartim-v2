import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";

test.group(
	"Features / Admin / Admin Management / Authentication / Controllers / Login Controller",
	() => {
		test("it should successfully login the admin with correct credentials", async ({ client }) => {
			const email = "test@example.com";
			const password = "password";
			const admin = await AdminFactory.merge({ email, password }).create();

			const response = await client.visit("admin.account_management.authentication.login").json({
				uid: email,
				password,
			});

			response.assertOk();
			response.assertBodyContains({
				id: admin.id,
			});
		});

		test("it should respond with E_INVALID_CREDENTIALS code if credentials are invalid", async ({
			client,
		}) => {
			const response = await client.visit("admin.account_management.authentication.login").json({
				uid: "invalid@example.com",
				password: "invalidpassword",
			});

			response.assertBadRequest();
			response.assertBodyContains({
				code: "E_INVALID_CREDENTIALS",
			});
		});

		test("it should response with E_GUEST_ONLY code if the admin is already authenticated", async ({
			client,
		}) => {
			const admin = await AdminFactory.create();

			const response = await client
				.visit("admin.account_management.authentication.login")
				.withGuard("admin")
				.loginAs(admin)
				.json({
					uid: admin.email,
					password: "password",
				});

			response.assertForbidden();
			response.assertBodyContains({
				code: "E_GUEST_ONLY",
			});
		});
	},
);
