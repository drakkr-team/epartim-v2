import { QueueManager } from "@adonisjs/queue";
import { test } from "@japa/runner";

import { UserFactory } from "#database/factories/user.factory";
import SendPasswordChangedNotification from "#features/user_management/password/jobs/send_password_changed_notification.job";
import User from "#models/user";
import OtpService from "#services/otp.service";

test.group("Features / User Management / Password / Controllers / Reset Controller", (group) => {
	group.each.teardown(() => {
		QueueManager.restore();
	});

	test("it should reset the password with a valid token and push a password changed notification job", async ({
		client,
		assert,
	}) => {
		const fakeQueueManager = QueueManager.fake();
		const otpService = new OtpService<{ userId: number }>();

		const password = "password";
		const newPassword = "newpassword";
		const user = await UserFactory.merge({ password }).create();
		const token = await otpService.generate({
			type: "alphanumeric",
			length: 32,
			expireIn: 60 * 15, // 15 minutes
			data: { userId: user.id },
		});

		const response = await client.visit("user_management.password.reset").json({
			token,
			newPassword,
		});

		const reloadedUser = await User.findOrFail(user.id);

		response.assertNoContent();
		assert.isFalse(await reloadedUser.verifyPassword(password));
		assert.isTrue(await reloadedUser.verifyPassword(newPassword));
		fakeQueueManager.assertPushed(SendPasswordChangedNotification);
	});

	test("it should respond with E_INVALID_TOKEN when already used token is provided", async ({
		client,
	}) => {
		const otpService = new OtpService<{ userId: number }>();

		const user = await UserFactory.create();
		const token = await otpService.generate({
			type: "alphanumeric",
			length: 32,
			expireIn: 60 * 15, // 15 minutes
			data: { userId: user.id },
		});

		await client.visit("user_management.password.reset").json({
			token,
			newPassword: "supersecret",
		});
		const response = await client.visit("user_management.password.reset").json({
			token,
			newPassword: "supersecret",
		});

		response.assertBadRequest();
		response.assertBodyContains({
			code: "E_INVALID_TOKEN",
		});
	});

	test("it should respond with E_INVALID_TOKEN when expired token is provided", async ({
		client,
	}) => {
		const otpService = new OtpService<{ userId: number }>();

		const user = await UserFactory.create();
		const token = await otpService.generate({
			type: "alphanumeric",
			length: 32,
			expireIn: 1, // 1 seconds
			data: { userId: user.id },
		});
		await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 1 seconds to ensure the token is expired

		const response = await client.visit("user_management.password.reset").json({
			token,
			newPassword: "supersecret",
		});

		response.assertBadRequest();
		response.assertBodyContains({
			code: "E_INVALID_TOKEN",
		});
	});

	test("it should respond with E_INVALID_TOKEN when invalid token is provided", async ({
		client,
	}) => {
		const response = await client.visit("user_management.password.reset").json({
			token: "not-a-valid-token",
			newPassword: "newpassword",
		});

		response.assertBadRequest();
		response.assertBodyContains({
			code: "E_INVALID_TOKEN",
		});
	});

	test("it should respond with E_GUEST_ONLY code if the user is already authenticated", async ({
		client,
	}) => {
		const user = await UserFactory.create();

		const response = await client.visit("user_management.password.reset").loginAs(user).json({
			token: "valid-token",
			newPassword: "newpassword",
		});

		response.assertForbidden();
		response.assertBodyContains({
			code: "E_GUEST_ONLY",
		});
	});
});
