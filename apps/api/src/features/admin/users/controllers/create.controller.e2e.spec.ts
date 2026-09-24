import hash from "@adonisjs/core/services/hash";
import { QueueManager } from "@adonisjs/queue";
import { test } from "@japa/runner";

import { USER_ROLES } from "#constants/user";
import { AdminFactory } from "#database/factories/admin.factory";
import { FirmFactory } from "#database/factories/firm.factory";
import { UserFactory } from "#database/factories/user.factory";
import SendUserOnboardingNotificationJob from "#features/client/account_management/onboarding/jobs/send_onboarding_notification.job";
import Role from "#models/role";
import User from "#models/user";

test.group("Features / Admin / Users / Controllers / Create Controller", (group) => {
	group.each.teardown(() => {
		QueueManager.restore();
	});

	test("it should create a user with the contract fields", async ({ client, assert }) => {
		const fakeQueueManager = QueueManager.fake();
		const authenticatedAdmin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(authenticatedAdmin.roleId);
		role.authorizations = ["create:user"];
		await role.save();
		const firm = await FirmFactory.with("address").with("paymentDetail").create();
		const payload = {
			firstName: "  Élodie  ",
			lastName: "  Gestionnaire  ",
			email: "new.user@example.com",
			role: USER_ROLES.FIRM,
			firmId: firm.id,
			password: "provided-password",
		};

		const response = await client
			.visit("admin.users.create")
			.withGuard("admin")
			.loginAs(authenticatedAdmin)
			.json(payload);

		response.assertCreated();
		response.assertBodyContains({
			firstName: "Élodie",
			lastName: "Gestionnaire",
			email: "new.user@example.com",
			role: USER_ROLES.FIRM,
			firmId: firm.id,
			activatedAt: null,
		});
		assert.notProperty(response.body(), "password");

		const createdUser = await User.findByOrFail("email", "new.user@example.com");
		assert.equal(createdUser.role, USER_ROLES.FIRM);
		assert.equal(createdUser.firmId, firm.id);
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
				email: existingUser.email,
				role: USER_ROLES.USER,
				firmId: null,
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
			.unsafeJson({
				firstName: " ",
				lastName: "A",
				email: "invalid-email",
				role: 999,
				firmId: 2_147_483_647,
			});

		response.assertStatus(422);
	});

	test("it should require admin authentication", async ({ client }) => {
		const response = await client.visit("admin.users.create").json({
			firstName: "New",
			lastName: "User",
			email: "new.user@example.com",
			role: USER_ROLES.USER,
			firmId: null,
		});

		response.assertUnauthorized();
		response.assertBodyContains({
			code: "E_UNAUTHENTICATED",
		});
	});
});
