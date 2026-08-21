import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import { UserFactory } from "#database/factories/user.factory";

test.group("Features / Admin / Users / Controllers / Update Controller", () => {
	test("it should update and normalize a user name", async ({ client, assert }) => {
		const authenticatedAdmin = await AdminFactory.create();
		const targetUser = await UserFactory.create();

		const response = await client
			.visit("admin.users.update", { userId: targetUser.id })
			.withGuard("admin")
			.loginAs(authenticatedAdmin)
			.json({
				firstName: "  Élodie  ",
				lastName: "  Gestionnaire  ",
			});

		response.assertOk();
		response.assertBodyContains({
			id: targetUser.id,
			firstName: "Élodie",
			lastName: "Gestionnaire",
		});
		assert.notProperty(response.body(), "password");
		await targetUser.refresh();
		assert.equal(targetUser.firstName, "Élodie");
		assert.equal(targetUser.lastName, "Gestionnaire");
	});

	test("it should ignore every field except names", async ({ client, assert }) => {
		const authenticatedAdmin = await AdminFactory.create();
		const targetUser = await UserFactory.create();
		const originalEmail = targetUser.email;
		const originalPassword = targetUser.password;
		const payload = {
			firstName: "Allowed",
			lastName: "Name",
			email: "changed@example.com",
			password: "changed-password",
		};

		const response = await client
			.patch(`/admin/users/${targetUser.id}`)
			.withGuard("admin")
			.loginAs(authenticatedAdmin)
			.json(payload as Pick<typeof payload, "firstName" | "lastName">);

		response.assertOk();
		await targetUser.refresh();
		assert.equal(targetUser.firstName, "Allowed");
		assert.equal(targetUser.lastName, "Name");
		assert.equal(targetUser.email, originalEmail);
		assert.equal(targetUser.password, originalPassword);
	});

	test("it should reject incomplete and invalid payloads", async ({ client }) => {
		const authenticatedAdmin = await AdminFactory.create();
		const targetUser = await UserFactory.create();

		for (const payload of [{}, { firstName: "Only" }, { firstName: " ", lastName: "User" }]) {
			const response = await client
				.patch(`/admin/users/${targetUser.id}`)
				.withGuard("admin")
				.loginAs(authenticatedAdmin)
				.json(payload);

			response.assertStatus(422);
		}
	});

	test("it should return not found for missing and invalid identifiers", async ({ client }) => {
		const authenticatedAdmin = await AdminFactory.create();

		for (const id of ["999999", "invalid", "0", "-1"]) {
			const response = await client
				.patch(`/admin/users/${id}`)
				.withGuard("admin")
				.loginAs(authenticatedAdmin)
				.json({ firstName: "Updated", lastName: "User" });

			response.assertNotFound();
		}
	});

	test("it should require admin authentication", async ({ client }) => {
		const targetUser = await UserFactory.create();
		const response = await client
			.visit("admin.users.update", { userId: targetUser.id })
			.json({ firstName: "Updated", lastName: "User" });

		response.assertUnauthorized();
		response.assertBodyContains({
			code: "E_UNAUTHENTICATED",
		});
	});
});
