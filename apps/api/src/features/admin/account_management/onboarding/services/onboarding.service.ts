import { HttpContext } from "@adonisjs/core/http";
import { DateTime } from "luxon";

import InvalidTokenException from "#exceptions/invalid_token.exception";
import SendAdminOnboardingNotificationJob from "#features/admin/account_management/onboarding/jobs/send_onboarding_notification.job";
import Admin from "#models/admin";
import OtpService from "#services/otp.service";
import env from "#start/env";

export default class AdminOnboardingService {
	constructor(
		protected ctx: HttpContext,
		protected otpService: OtpService<{ adminId: number }>,
	) {}

	async send(admin: Admin) {
		const token = await this.otpService.generate({
			key: `admin:${admin.id}:onboarding`,
			type: "alphanumeric",
			length: 32,
			expireIn: 60 * 60 * 24 * 7, // 1 week
			data: { adminId: admin.id },
		});

		const onboardingUrl = new URL("/onboarding", env.get("ADMIN_URL"));
		onboardingUrl.searchParams.set("token", token);

		await SendAdminOnboardingNotificationJob.dispatch({
			admin,
			onboardingUrl,
		});
	}

	async activate(params: { token: string; newPassword: string }) {
		const { token, newPassword } = params;

		const { adminId } = await this.otpService.verify(token);

		const admin = await Admin.find(adminId);
		if (!admin) throw new InvalidTokenException();

		await this.otpService.revoke(`admin:${admin.id}:onboarding`);
		await admin.merge({ password: newPassword, activatedAt: DateTime.now() }).save();
		await this.ctx.auth.use("admin").login(admin);

		return admin;
	}
}
