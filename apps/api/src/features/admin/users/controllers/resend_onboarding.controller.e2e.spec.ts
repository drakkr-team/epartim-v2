import { QueueManager } from "@adonisjs/queue";
import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import { UserFactory } from "#database/factories/user.factory";
import SendUserOnboardingNotificationJob from "#features/client/account_management/onboarding/jobs/send_onboarding_notification.job";
import Role from "#models/role";

test.group("Features / Admin / Users / Controllers / Resend Onboarding Controller", (group) => {
	group.each.teardown(() => {
		QueueManager.restore();
	});

	test("it should resend onboarding to an inactive user", async ({ client }) => {
		const fakeQueueManager = QueueManager.fake();
		const currentAdmin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(currentAdmin.roleId);
		role.authorizations = ["create:user"];
		await role.save();
		const targetUser = await UserFactory.apply("unactive").create();

		const response = await client
			.visit("admin.users.resend_onboarding", { userId: targetUser.id })
			.withGuard("admin")
			.loginAs(currentAdmin);

		response.assertNoContent();
		fakeQueueManager.assertPushed(SendUserOnboardingNotificationJob);
	});

	test("it should forbid onboarding for an active user", async ({ client }) => {
		const currentAdmin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(currentAdmin.roleId);
		role.authorizations = ["create:user"];
		await role.save();
		const targetUser = await UserFactory.apply("active").create();

		const response = await client
			.visit("admin.users.resend_onboarding", { userId: targetUser.id })
			.withGuard("admin")
			.loginAs(currentAdmin);

		response.assertForbidden();
	});

	test("it should forbid an admin without create authorization", async ({ client }) => {
		const currentAdmin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(currentAdmin.roleId);
		role.authorizations = [];
		await role.save();
		const targetUser = await UserFactory.apply("unactive").create();

		const response = await client
			.visit("admin.users.resend_onboarding", { userId: targetUser.id })
			.withGuard("admin")
			.loginAs(currentAdmin);

		response.assertForbidden();
	});

	test("it should return not found for a missing user", async ({ client }) => {
		const currentAdmin = await AdminFactory.with("role").create();

		const response = await client
			.visit("admin.users.resend_onboarding", { userId: 2_147_483_647 })
			.withGuard("admin")
			.loginAs(currentAdmin);

		response.assertNotFound();
	});

	test("it should reject unauthenticated requests", async ({ client }) => {
		const targetUser = await UserFactory.apply("unactive").create();

		const response = await client.visit("admin.users.resend_onboarding", {
			userId: targetUser.id,
		});

		response.assertUnauthorized();
		response.assertBodyContains({ code: "E_UNAUTHENTICATED" });
	});
});
