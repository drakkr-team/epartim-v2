import hash from "@adonisjs/core/services/hash";
import { QueueManager } from "@adonisjs/queue";
import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import { UserFactory } from "#database/factories/user.factory";
import SendUserOnboardingNotificationJob from "#features/client/account_management/onboarding/jobs/send_onboarding_notification.job";
import Role from "#models/role";
import User from "#models/user";

test.group("Features / Admin / Users / Controllers / Create Controller", (group) => {
	group.each.teardown(() => {
		QueueManager.restore();
	});

	test("it should create a user with normalized fields", async ({ client, assert }) => {
		const fakeQueueManager = QueueManager.fake();
		const authenticatedAdmin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(authenticatedAdmin.roleId);
		role.authorizations = ["create:user"];
		await role.save();
		const payload = {
			firstName: "  Élodie  ",
			lastName: "  Gestionnaire  ",
			email: "  NEW.USER@EXAMPLE.COM  ",
			password: "provided-password",
		};

		const response = await client
			.post("/admin/users")
			.withGuard("admin")
			.loginAs(authenticatedAdmin)
			.json(payload as Pick<typeof payload, "firstName" | "lastName" | "email">);

		response.assertCreated();
		response.assertBodyContains({
			firstName: "Élodie",
			lastName: "Gestionnaire",
			email: "new.user@example.com",
			activatedAt: null,
		});
		assert.notProperty(response.body(), "password");

		const createdUser = await User.findByOrFail("email", "new.user@example.com");
		assert.isFalse(await hash.verify(createdUser.password, "provided-password"));
		fakeQueueManager.assertPushed(SendUserOnboardingNotificationJob);
	});

	test("it should reject an email already used by a user", async ({ client }) => {
		const authenticatedAdmin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(authenticatedAdmin.roleId);
		role.authorizations = ["create:user"];
		await role.save();
		const existingUser = await UserFactory.merge({ email: "existing@example.com" }).create();

		const response = await client
			.visit("admin.users.create")
			.withGuard("admin")
			.loginAs(authenticatedAdmin)
			.json({
				firstName: "Another",
				lastName: "User",
				email: `  ${existingUser.email.toUpperCase()}  `,
			});

		response.assertStatus(422);
	});

	test("it should reject invalid payloads", async ({ client }) => {
		const authenticatedAdmin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(authenticatedAdmin.roleId);
		role.authorizations = ["create:user"];
		await role.save();

		const response = await client
			.visit("admin.users.create")
			.withGuard("admin")
			.loginAs(authenticatedAdmin)
			.json({
				firstName: " ",
				lastName: "A",
				email: "invalid-email",
			});

		response.assertStatus(422);
	});

	test("it should require admin authentication", async ({ client }) => {
		const response = await client.visit("admin.users.create").json({
			firstName: "New",
			lastName: "User",
			email: "new.user@example.com",
		});

		response.assertUnauthorized();
		response.assertBodyContains({
			code: "E_UNAUTHENTICATED",
		});
	});
});
