import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";

import InvalidTokenException from "#exceptions/invalid_token.exception";
import InvalidCredentialsException from "#features/user_management/authentication/exceptions/invalid_credentials.exception";
import SendPasswordChangedNotification from "#features/user_management/password/jobs/send_password_changed_notification.job";
import SendResetPasswordInstruction from "#features/user_management/password/jobs/send_reset_password_instruction.job";
import User from "#models/user";
import OtpService from "#services/otp.service";
import env from "#start/env";

@inject()
export default class PasswordService {
	constructor(
		protected ctx: HttpContext,
		protected otpService: OtpService<{ userId: number }>,
	) {}

	async update(params: { currentPassword: string; newPassword: string }) {
		const { currentPassword, newPassword } = params;

		const user = this.ctx.auth.user!;
		const isValidCredentials = await user.verifyPassword(currentPassword);
		if (!isValidCredentials) throw new InvalidCredentialsException();

		await user.merge({ password: newPassword }).save();
		await SendPasswordChangedNotification.dispatch({
			user,
			loginUrl: new URL("/login", env.get("FRONTEND_URL")),
		});
		await this.ctx.auth.use("web").logout();
	}

	async forgot(email: string) {
		const user = await User.findBy("email", email);
		if (!user) return;

		const token = await this.otpService.generate({
			type: "alphanumeric",
			length: 32,
			expireIn: 60 * 15, // 15 minutes
			data: { userId: user.id },
		});

		const resetPasswordUrl = new URL("/reset-password", env.get("FRONTEND_URL"));
		resetPasswordUrl.searchParams.set("token", token);

		await SendResetPasswordInstruction.dispatch({ user, resetPasswordUrl });
	}

	async reset(params: { token: string; newPassword: string }) {
		const { token, newPassword } = params;

		const { userId } = await this.otpService.verify(token);

		const user = await User.find(userId);
		if (!user) throw new InvalidTokenException();

		await user.merge({ password: newPassword }).save();

		await SendPasswordChangedNotification.dispatch({
			user,
			loginUrl: new URL("/login", env.get("FRONTEND_URL")),
		});
	}
}
