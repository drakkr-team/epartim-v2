import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import { UserFactory } from "#database/factories/user.factory";
import User from "#models/user";

test.group("Features / Admin / Users / Controllers / Delete Controller", () => {
	test("it should permanently delete a user", async ({ client, assert }) => {
		const authenticatedAdmin = await AdminFactory.create();
		const targetUser = await UserFactory.create();

		const response = await client
			.visit("admin.users.delete", { userId: targetUser.id })
			.withGuard("admin")
			.loginAs(authenticatedAdmin);

		response.assertNoContent();
		assert.isNull(await User.find(targetUser.id));
	});

	test("it should return not found for missing identifiers", async ({ client }) => {
		const authenticatedAdmin = await AdminFactory.create();

		for (const id of ["999999", "0", "-1"]) {
			const response = await client
				.delete(`/admin/users/${id}`)
				.withGuard("admin")
				.loginAs(authenticatedAdmin);

			response.assertNotFound();
		}
	});

	test("it should require admin authentication", async ({ client }) => {
		const targetUser = await UserFactory.create();
		const response = await client.visit("admin.users.delete", {
			userId: targetUser.id,
		});

		response.assertUnauthorized();
		response.assertBodyContains({
			code: "E_UNAUTHENTICATED",
		});
	});
});
