import { test } from "@japa/runner";

import { UserFactory } from "#database/factories/user.factory";
import User from "#models/user";
import OtpService from "#services/otp.service";

test.group(
	"Features / Client / Account Management / Onboarding / Controllers / Activate Controller",
	() => {
		test("it should activate a user with a valid token", async ({ client, assert }) => {
			const oldPassword = "oldpassword";
			const newPassword = "newpassword";
			const user = await UserFactory.apply("unactive").merge({ password: oldPassword }).create();
			const otpService = new OtpService<{ userId: number }>();
			const token = await otpService.generate({
				key: `user:${user.id}:onboarding`,
				type: "alphanumeric",
				length: 32,
				expireIn: 60,
				data: { userId: user.id },
			});

			const response = await client
				.visit("client.account_management.onboarding.activate")
				.json({ token, newPassword });

			const reloadedUser = await User.findOrFail(user.id);
			response.assertNoContent();
			assert.isNotNull(reloadedUser.activatedAt);
			assert.isFalse(await reloadedUser.verifyPassword(oldPassword));
			assert.isTrue(await reloadedUser.verifyPassword(newPassword));
		});

		test("it should reject a consumed token", async ({ client }) => {
			const user = await UserFactory.apply("unactive").create();
			const otpService = new OtpService<{ userId: number }>();
			const token = await otpService.generate({
				key: `user:${user.id}:onboarding`,
				type: "alphanumeric",
				length: 32,
				expireIn: 60,
				data: { userId: user.id },
			});

			await client
				.visit("client.account_management.onboarding.activate")
				.json({ token, newPassword: "newpassword" });
			const response = await client
				.visit("client.account_management.onboarding.activate")
				.json({ token, newPassword: "otherpassword" });

			response.assertBadRequest();
			response.assertBodyContains({ code: "E_INVALID_TOKEN" });
		});

		test("it should reject a token for a missing user", async ({ client }) => {
			const otpService = new OtpService<{ userId: number }>();
			const token = await otpService.generate({
				key: "user:2147483647:onboarding",
				type: "alphanumeric",
				length: 32,
				expireIn: 60,
				data: { userId: 2_147_483_647 },
			});

			const response = await client
				.visit("client.account_management.onboarding.activate")
				.json({ token, newPassword: "newpassword" });

			response.assertBadRequest();
			response.assertBodyContains({ code: "E_INVALID_TOKEN" });
		});

		test("it should reject invalid input", async ({ client }) => {
			const response = await client
				.visit("client.account_management.onboarding.activate")
				.json({ token: "", newPassword: "short" });

			response.assertStatus(422);
		});

		test("it should reject an authenticated user", async ({ client }) => {
			const user = await UserFactory.apply("active").create();

			const response = await client
				.visit("client.account_management.onboarding.activate")
				.withGuard("client")
				.loginAs(user)
				.json({ token: "valid-token", newPassword: "newpassword" });

			response.assertForbidden();
			response.assertBodyContains({ code: "E_GUEST_ONLY" });
		});
	},
);
