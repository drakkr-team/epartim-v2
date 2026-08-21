import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";

import InvalidTokenException from "#exceptions/invalid_token.exception";
import SendPasswordChangedNotification from "#features/admin/account_management/password/jobs/send_password_changed_notification.job";
import SendResetPasswordInstruction from "#features/admin/account_management/password/jobs/send_reset_password_instruction.job";
import Admin from "#models/admin";
import OtpService from "#services/otp.service";
import env from "#start/env";

@inject()
export default class PasswordService {
	constructor(
		protected ctx: HttpContext,
		protected otpService: OtpService<{ adminId: number }>,
	) {}

	async forgot(email: string) {
		const admin = await Admin.findBy("email", email);
		if (!admin) return;

		const token = await this.otpService.generate({
			type: "alphanumeric",
			length: 32,
			expireIn: 60 * 15, // 15 minutes
			data: { adminId: admin.id },
		});

		const resetPasswordUrl = new URL("/reset-password", env.get("ADMIN_URL"));
		resetPasswordUrl.searchParams.set("token", token);

		await SendResetPasswordInstruction.dispatch({ admin, resetPasswordUrl });
	}

	async reset(params: { token: string; newPassword: string }) {
		const { token, newPassword } = params;

		const { adminId } = await this.otpService.verify(token);

		const admin = await Admin.find(adminId);
		if (!admin) throw new InvalidTokenException();

		await admin.merge({ password: newPassword }).save();

		await SendPasswordChangedNotification.dispatch({
			admin,
			loginUrl: new URL("/login", env.get("ADMIN_URL")),
		});
	}
}
