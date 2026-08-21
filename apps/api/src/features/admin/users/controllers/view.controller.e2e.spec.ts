import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import { UserFactory } from "#database/factories/user.factory";

test.group("Features / Admin / Users / Controllers / View Controller", () => {
	test("it should return a user without the password", async ({ client, assert }) => {
		const authenticatedAdmin = await AdminFactory.create();
		const targetUser = await UserFactory.create();

		const response = await client
			.visit("admin.users.view", { userId: targetUser.id })
			.withGuard("admin")
			.loginAs(authenticatedAdmin);

		response.assertOk();
		response.assertBodyContains({
			id: targetUser.id,
			firstName: targetUser.firstName,
			lastName: targetUser.lastName,
			email: targetUser.email,
		});
		assert.notProperty(response.body(), "password");
	});

	test("it should return not found for missing and invalid identifiers", async ({ client }) => {
		const authenticatedAdmin = await AdminFactory.create();

		for (const id of ["999999", "invalid", "0", "-1"]) {
			const response = await client
				.get(`/admin/users/${id}`)
				.withGuard("admin")
				.loginAs(authenticatedAdmin);

			response.assertNotFound();
		}
	});

	test("it should require admin authentication", async ({ client }) => {
		const targetUser = await UserFactory.create();
		const response = await client.visit("admin.users.view", { userId: targetUser.id });

		response.assertUnauthorized();
		response.assertBodyContains({
			code: "E_UNAUTHENTICATED",
		});
	});
});
