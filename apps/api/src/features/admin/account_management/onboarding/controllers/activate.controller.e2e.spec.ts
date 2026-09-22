import { test } from "@japa/runner";

import { AdminFactory } from "#database/factories/admin.factory";
import Admin from "#models/admin";
import OtpService from "#services/otp.service";

test.group(
	"Features / Admin / Account Management / Onboarding / Controllers / Activate Controller",
	() => {
		test("it should activate an admin with a valid token", async ({ client, assert }) => {
			const oldPassword = "oldpassword";
			const newPassword = "newpassword";
			const admin = await AdminFactory.apply("unactive")
				.merge({ password: oldPassword })
				.with("role")
				.create();
			const otpService = new OtpService<{ adminId: number }>();
			const token = await otpService.generate({
				key: `admin:${admin.id}:onboarding`,
				type: "alphanumeric",
				length: 32,
				expireIn: 60,
				data: { adminId: admin.id },
			});

			const response = await client
				.visit("admin.account_management.onboarding.activate")
				.json({ token, newPassword });

			const reloadedAdmin = await Admin.findOrFail(admin.id);
			response.assertNoContent();
			assert.isNotNull(reloadedAdmin.activatedAt);
			assert.isFalse(await reloadedAdmin.verifyPassword(oldPassword));
			assert.isTrue(await reloadedAdmin.verifyPassword(newPassword));
		});

		test("it should reject a consumed token", async ({ client }) => {
			const admin = await AdminFactory.apply("unactive").with("role").create();
			const otpService = new OtpService<{ adminId: number }>();
			const token = await otpService.generate({
				key: `admin:${admin.id}:onboarding`,
				type: "alphanumeric",
				length: 32,
				expireIn: 60,
				data: { adminId: admin.id },
			});

			await client
				.visit("admin.account_management.onboarding.activate")
				.json({ token, newPassword: "newpassword" });
			const response = await client
				.visit("admin.account_management.onboarding.activate")
				.json({ token, newPassword: "otherpassword" });

			response.assertBadRequest();
			response.assertBodyContains({ code: "E_INVALID_TOKEN" });
		});

		test("it should reject a token for a missing admin", async ({ client }) => {
			const otpService = new OtpService<{ adminId: number }>();
			const token = await otpService.generate({
				key: "admin:2147483647:onboarding",
				type: "alphanumeric",
				length: 32,
				expireIn: 60,
				data: { adminId: 2_147_483_647 },
			});

			const response = await client
				.visit("admin.account_management.onboarding.activate")
				.json({ token, newPassword: "newpassword" });

			response.assertBadRequest();
			response.assertBodyContains({ code: "E_INVALID_TOKEN" });
		});

		test("it should reject invalid input", async ({ client }) => {
			const response = await client
				.visit("admin.account_management.onboarding.activate")
				.json({ token: "", newPassword: "short" });

			response.assertStatus(422);
		});

		test("it should reject an authenticated admin", async ({ client }) => {
			const admin = await AdminFactory.apply("active").with("role").create();

			const response = await client
				.visit("admin.account_management.onboarding.activate")
				.withGuard("admin")
				.loginAs(admin)
				.json({ token: "valid-token", newPassword: "newpassword" });

			response.assertForbidden();
			response.assertBodyContains({ code: "E_GUEST_ONLY" });
		});
	},
);
