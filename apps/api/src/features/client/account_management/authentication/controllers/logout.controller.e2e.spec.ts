import { test } from "@japa/runner";

import { UserFactory } from "#database/factories/user.factory";

test.group(
	"Features / Account Management / Authentication / Controllers / Logout Controller",
	() => {
		test("it should logout the user successfully", async ({ client }) => {
			const user = await UserFactory.create();

			const response = await client
				.visit("client.account_management.authentication.logout")
				.loginAs(user);

			response.assertNoContent();
		});

		test("it should respond with E_UNAUTHENTICATED code if not authenticated", async ({
			client,
		}) => {
			const response = await client.visit("client.account_management.authentication.logout");

			response.assertUnauthorized();
			response.assertBodyContains({
				code: "E_UNAUTHENTICATED",
			});
		});
	},
);
