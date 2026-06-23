import { test } from "@japa/runner";

import { UserFactory } from "#database/factories/user.factory";

test.group("Features / User Management / Authentication / Controllers / Login Controller", () => {
	test("it should successfully login the user with correct credentials", async ({ client }) => {
		const email = "test@example.com";
		const password = "password";
		const user = await UserFactory.merge({ email, password }).create();

		const response = await client.visit("user_management.authentication.login").json({
			uid: email,
			password,
		});

		response.assertOk();
		response.assertBodyContains({
			id: user.id,
		});
	});

	test("it should respond with E_INVALID_CREDENTIALS code if credentials are invalid", async ({
		client,
	}) => {
		const response = await client.visit("user_management.authentication.login").json({
			uid: "invalid@example.com",
			password: "invalidpassword",
		});

		response.assertBadRequest();
		response.assertBodyContains({
			code: "E_INVALID_CREDENTIALS",
		});
	});

	test("it should response with E_GUEST_ONLY code if the user is already authenticated", async ({
		client,
	}) => {
		const user = await UserFactory.create();

		const response = await client.visit("user_management.authentication.login").loginAs(user).json({
			uid: user.email,
			password: "password",
		});

		response.assertForbidden();
		response.assertBodyContains({
			code: "E_GUEST_ONLY",
		});
	});
});
