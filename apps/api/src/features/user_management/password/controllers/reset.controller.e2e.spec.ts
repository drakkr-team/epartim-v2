import { QueueManager } from "@adonisjs/queue";
import { test } from "@japa/runner";
import { DateTime } from "luxon";

import { UserFactory } from "#database/factories/user.factory";
import SendPasswordChangedNotification from "#features/user_management/password/jobs/send_password_changed_notification.job";
import User from "#models/user";
import { UserTokenType } from "#models/user_token";
import UserTokenService from "#services/user_token.service";

test.group("Features / User Management / Password / Controllers / Reset Controller", (group) => {
	group.each.teardown(() => {
		QueueManager.restore();
	});

	test("it should reset the password with a valid token and push a password changed notification job", async ({
		client,
		assert,
	}) => {
		const fakeQueueManager = QueueManager.fake();
		const userTokenService = new UserTokenService();

		const password = "password";
		const newPassword = "newpassword";
		const user = await UserFactory.merge({ password }).create();
		const token = await userTokenService.generate({
			user,
			type: UserTokenType.RESET_PASSWORD,
			expiresAt: DateTime.now().plus({ hours: 1 }),
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
		const userTokenService = new UserTokenService();

		const user = await UserFactory.create();
		const token = await userTokenService.generate({
			user,
			type: UserTokenType.RESET_PASSWORD,
			expiresAt: DateTime.now().plus({ hours: 1 }),
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
		const userTokenService = new UserTokenService();

		const user = await UserFactory.create();
		const token = await userTokenService.generate({
			user,
			type: UserTokenType.RESET_PASSWORD,
			expiresAt: DateTime.now().minus({ hours: 1 }),
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
