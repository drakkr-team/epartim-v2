import { QueueManager } from "@adonisjs/queue";
import { test } from "@japa/runner";

import { UserFactory } from "#database/factories/user.factory";
import SendResetPasswordInstruction from "#features/user_management/password/jobs/send_reset_password_instruction.job";

test.group("Features / User Management / Password / Controllers / Forgot Controller", (group) => {
	group.each.teardown(() => {
		QueueManager.restore();
	});

	test("it should respond with no content and push a reset password job for an existing email", async ({
		client,
	}) => {
		const fakeQueueManager = QueueManager.fake();

		const user = await UserFactory.merge({ password: "password" }).create();

		const response = await client.visit("user_management.password.forgot").json({
			email: user.email,
		});

		response.assertNoContent();
		fakeQueueManager.assertPushed(SendResetPasswordInstruction);
	});

	test("it should respond with no content and not push a reset password job for a missing email", async ({
		client,
	}) => {
		const fakeQueueManager = QueueManager.fake();

		const response = await client.visit("user_management.password.forgot").json({
			email: "missing@example.com",
		});

		response.assertNoContent();
		fakeQueueManager.assertNotPushed(SendResetPasswordInstruction);
	});

	test("it should respond with E_GUEST_ONLY code if the user is already authenticated", async ({
		client,
	}) => {
		const user = await UserFactory.create();

		const response = await client.visit("user_management.password.forgot").loginAs(user).json({
			email: user.email,
		});

		response.assertForbidden();
		response.assertBodyContains({
			code: "E_GUEST_ONLY",
		});
	});
});
