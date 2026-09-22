import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import { UserFactory } from "#database/factories/user.factory";
import Role from "#models/role";

test.group("Features / Admin / Users / Controllers / View Controller", () => {
	test("it should return a user without the password", async ({ client, assert }) => {
		const authenticatedAdmin = await AdminFactory.with("role").create();
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

	test("it should return onboarding authorization metadata", async ({ client }) => {
		const authenticatedAdmin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(authenticatedAdmin.roleId);
		role.authorizations = ["create:user"];
		await role.save();
		const targetUser = await UserFactory.apply("unactive").create();

		const response = await client
			.visit("admin.users.view", { userId: targetUser.id })
			.withGuard("admin")
			.loginAs(authenticatedAdmin);

		response.assertOk();
		response.assertBodyContains({
			meta: {
				canResendOnboarding: true,
			},
		});
	});

	test("it should return not found for missing identifiers", async ({ client }) => {
		const authenticatedAdmin = await AdminFactory.with("role").create();

		for (const id of ["999999", "0", "-1"]) {
			const response = await client
				.visit("admin.users.view", { userId: id })
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
