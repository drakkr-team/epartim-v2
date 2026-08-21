import { createHmac } from "node:crypto";

import { QueueManager } from "@adonisjs/queue";
import redis from "@adonisjs/redis/services/main";
import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import SendPasswordChangedNotification from "#features/admin/account_management/password/jobs/send_password_changed_notification.job";
import Admin from "#models/admin";
import OtpService from "#services/otp.service";
import env from "#start/env";

test.group(
	"Features / Admin / Admin Management / Password / Controllers / Reset Controller",
	(group) => {
		group.each.teardown(() => {
			QueueManager.restore();
		});

		test("it should reset the password with a valid token and push a password changed notification job", async ({
			client,
			assert,
		}) => {
			const fakeQueueManager = QueueManager.fake();
			const otpService = new OtpService<{ adminId: number }>();

			const password = "password";
			const newPassword = "newpassword";
			const admin = await AdminFactory.merge({ password }).create();
			const token = await otpService.generate({
				type: "alphanumeric",
				length: 32,
				expireIn: 60 * 15, // 15 minutes
				data: { adminId: admin.id },
			});

			const response = await client.visit("admin.account_management.password.reset").json({
				token,
				newPassword,
			});

			const reloadedAdmin = await Admin.findOrFail(admin.id);

			response.assertNoContent();
			assert.isFalse(await reloadedAdmin.verifyPassword(password));
			assert.isTrue(await reloadedAdmin.verifyPassword(newPassword));
			fakeQueueManager.assertPushed(SendPasswordChangedNotification);
		});

		test("it should respond with E_INVALID_TOKEN when already used token is provided", async ({
			client,
		}) => {
			const otpService = new OtpService<{ adminId: number }>();

			const admin = await AdminFactory.create();
			const token = await otpService.generate({
				type: "alphanumeric",
				length: 32,
				expireIn: 60 * 15, // 15 minutes
				data: { adminId: admin.id },
			});

			await client.visit("admin.account_management.password.reset").json({
				token,
				newPassword: "supersecret",
			});
			const response = await client.visit("admin.account_management.password.reset").json({
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
			const otpService = new OtpService<{ adminId: number }>();

			const admin = await AdminFactory.create();
			const token = await otpService.generate({
				type: "alphanumeric",
				length: 32,
				expireIn: 60,
				data: { adminId: admin.id },
			});
			const hashedToken = createHmac("sha256", env.get("APP_KEY")).update(token).digest("hex");
			await redis.del(`otp:${hashedToken}`);

			const response = await client.visit("admin.account_management.password.reset").json({
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
			const response = await client.visit("admin.account_management.password.reset").json({
				token: "not-a-valid-token",
				newPassword: "newpassword",
			});

			response.assertBadRequest();
			response.assertBodyContains({
				code: "E_INVALID_TOKEN",
			});
		});

		test("it should respond with E_GUEST_ONLY code if the admin is already authenticated", async ({
			client,
		}) => {
			const admin = await AdminFactory.create();

			const response = await client
				.visit("admin.account_management.password.reset")
				.withGuard("admin")
				.loginAs(admin)
				.json({
					token: "valid-token",
					newPassword: "newpassword",
				});

			response.assertForbidden();
			response.assertBodyContains({
				code: "E_GUEST_ONLY",
			});
		});
	},
);
