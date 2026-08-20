import { QueueManager } from "@adonisjs/queue";
import { test } from "@japa/runner";

import { UserFactory } from "#database/factories/user.factory";
import SendPasswordChangedNotification from "#features/user_management/password/jobs/send_password_changed_notification.job";
import User from "#models/user";

test.group("Features / User Management / Password / Controllers / Update Controller", (group) => {
	group.each.teardown(() => {
		QueueManager.restore();
	});

	test("it should respond with no content, persist the new password, and push a password changed notification job", async ({
		client,
		assert,
	}) => {
		const fakeQueueManager = QueueManager.fake();

		const currentPassword = "password123";
		const newPassword = "newpassword123";
		const user = await UserFactory.merge({ password: currentPassword }).create();

		const response = await client.visit("user_management.password.update").loginAs(user).json({
			currentPassword,
			newPassword,
		});

		response.assertNoContent();

		const updatedUser = await User.findOrFail(user.id);

		assert.isFalse(await updatedUser.verifyPassword(currentPassword));
		assert.isTrue(await updatedUser.verifyPassword(newPassword));
		fakeQueueManager.assertPushed(SendPasswordChangedNotification);
	});

	test("it should respond with E_INVALID_CREDENTIALS when the current password is wrong", async ({
		client,
	}) => {
		const currentPassword = "password123";
		const wrongCurrentPassword = "wrongpassword123";
		const newPassword = "newpassword123";
		const user = await UserFactory.merge({ password: currentPassword }).create();

		const response = await client.visit("user_management.password.update").loginAs(user).json({
			currentPassword: wrongCurrentPassword,
			newPassword,
		});

		response.assertBadRequest();
		response.assertBodyContains({
			code: "E_INVALID_CREDENTIALS",
		});
	});

	test("it should respond with E_UNAUTHENTICATED when the user is not authenticated", async ({
		client,
	}) => {
		const response = await client.visit("user_management.password.update").json({
			currentPassword: "password123",
			newPassword: "newpassword123",
		});

		response.assertUnauthorized();
		response.assertBodyContains({
			code: "E_UNAUTHENTICATED",
		});
	});
});
