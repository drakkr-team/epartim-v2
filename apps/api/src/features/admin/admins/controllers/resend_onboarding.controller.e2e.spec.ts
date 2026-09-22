import { QueueManager } from "@adonisjs/queue";
import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import SendAdminOnboardingNotificationJob from "#features/admin/account_management/onboarding/jobs/send_onboarding_notification.job";
import Role from "#models/role";

test.group("Features / Admin / Admins / Controllers / Resend Onboarding Controller", (group) => {
	group.each.teardown(() => {
		QueueManager.restore();
	});

	test("it should resend onboarding to an inactive admin", async ({ client }) => {
		const fakeQueueManager = QueueManager.fake();
		const currentAdmin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(currentAdmin.roleId);
		role.authorizations = ["create:admin"];
		await role.save();
		const targetAdmin = await AdminFactory.apply("unactive").with("role").create();

		const response = await client
			.visit("admin.admins.resend_onboarding", { adminId: targetAdmin.id })
			.withGuard("admin")
			.loginAs(currentAdmin);

		response.assertNoContent();
		fakeQueueManager.assertPushed(SendAdminOnboardingNotificationJob);
	});

	test("it should forbid onboarding for an active admin", async ({ client }) => {
		const currentAdmin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(currentAdmin.roleId);
		role.authorizations = ["create:admin"];
		await role.save();
		const targetAdmin = await AdminFactory.apply("active").with("role").create();

		const response = await client
			.visit("admin.admins.resend_onboarding", { adminId: targetAdmin.id })
			.withGuard("admin")
			.loginAs(currentAdmin);

		response.assertForbidden();
	});

	test("it should forbid an admin without create authorization", async ({ client }) => {
		const currentAdmin = await AdminFactory.with("role").create();
		const role = await Role.findOrFail(currentAdmin.roleId);
		role.authorizations = [];
		await role.save();
		const targetAdmin = await AdminFactory.apply("unactive").with("role").create();

		const response = await client
			.visit("admin.admins.resend_onboarding", { adminId: targetAdmin.id })
			.withGuard("admin")
			.loginAs(currentAdmin);

		response.assertForbidden();
	});

	test("it should return not found for a missing admin", async ({ client }) => {
		const currentAdmin = await AdminFactory.with("role").create();

		const response = await client
			.visit("admin.admins.resend_onboarding", { adminId: 2_147_483_647 })
			.withGuard("admin")
			.loginAs(currentAdmin);

		response.assertNotFound();
	});

	test("it should reject unauthenticated requests", async ({ client }) => {
		const targetAdmin = await AdminFactory.apply("unactive").with("role").create();

		const response = await client.visit("admin.admins.resend_onboarding", {
			adminId: targetAdmin.id,
		});

		response.assertUnauthorized();
		response.assertBodyContains({ code: "E_UNAUTHENTICATED" });
	});
});
