import { QueueManager } from "@adonisjs/queue";
import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import SendResetPasswordInstruction from "#features/admin/account_management/password/jobs/send_reset_password_instruction.job";

test.group(
	"Features / Admin / Admin Management / Password / Controllers / Forgot Controller",
	(group) => {
		group.each.teardown(() => {
			QueueManager.restore();
		});

		test("it should respond with no content and push a reset password job for an existing email", async ({
			client,
		}) => {
			const fakeQueueManager = QueueManager.fake();

			const admin = await AdminFactory.create();

			const response = await client.visit("admin.account_management.password.forgot").json({
				email: admin.email,
			});

			response.assertNoContent();
			fakeQueueManager.assertPushed(SendResetPasswordInstruction);
		});

		test("it should respond with no content and not push a reset password job for a missing email", async ({
			client,
		}) => {
			const fakeQueueManager = QueueManager.fake();

			const response = await client.visit("admin.account_management.password.forgot").json({
				email: "missing@example.com",
			});

			response.assertNoContent();
			fakeQueueManager.assertNotPushed(SendResetPasswordInstruction);
		});

		test("it should respond with E_GUEST_ONLY code if the admin is already authenticated", async ({
			client,
		}) => {
			const admin = await AdminFactory.create();

			const response = await client
				.visit("admin.account_management.password.forgot")
				.withGuard("admin")
				.loginAs(admin)
				.json({
					email: admin.email,
				});

			response.assertForbidden();
			response.assertBodyContains({
				code: "E_GUEST_ONLY",
			});
		});
	},
);
