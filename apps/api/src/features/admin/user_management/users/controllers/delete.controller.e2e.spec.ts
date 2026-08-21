import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import { UserFactory } from "#database/factories/user.factory";
import User from "#models/user";

test.group("Features / Admin / User Management / Users / Controllers / Delete Controller", () => {
	test("it should permanently delete a user", async ({ client, assert }) => {
		const authenticatedAdmin = await AdminFactory.create();
		const targetUser = await UserFactory.create();

		const response = await client
			.visit("admin.user_management.users.delete", { id: targetUser.id })
			.withGuard("admin")
			.loginAs(authenticatedAdmin);

		response.assertNoContent();
		assert.isNull(await User.find(targetUser.id));
	});

	test("it should return not found for missing and invalid identifiers", async ({ client }) => {
		const authenticatedAdmin = await AdminFactory.create();

		for (const id of ["999999", "invalid", "0", "-1"]) {
			const response = await client
				.delete(`/admin/user-management/users/${id}`)
				.withGuard("admin")
				.loginAs(authenticatedAdmin);

			response.assertNotFound();
		}
	});

	test("it should require admin authentication", async ({ client }) => {
		const targetUser = await UserFactory.create();
		const response = await client.visit("admin.user_management.users.delete", {
			id: targetUser.id,
		});

		response.assertUnauthorized();
		response.assertBodyContains({
			code: "E_UNAUTHENTICATED",
		});
	});
});
