import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import { DateTime } from "luxon";

import InvalidTokenException from "#exceptions/invalid_token.exception";
import SendUserOnboardingNotificationJob from "#features/client/account_management/onboarding/jobs/send_onboarding_notification.job";
import User from "#models/user";
import OtpService from "#services/otp.service";
import env from "#start/env";

@inject()
export default class UserOnboardingService {
	constructor(
		protected ctx: HttpContext,
		protected otpService: OtpService<{ userId: number }>,
	) {}

	async send(user: User) {
		const token = await this.otpService.generate({
			key: `user:${user.id}:onboarding`,
			type: "alphanumeric",
			length: 32,
			expireIn: 60 * 60 * 24 * 7, // 1 week
			data: { userId: user.id },
		});

		const onboardingUrl = new URL("/onboarding", env.get("FRONTEND_URL"));
		onboardingUrl.searchParams.set("token", token);

		await SendUserOnboardingNotificationJob.dispatch({
			user,
			onboardingUrl,
		});
	}

	async activate(params: { token: string; newPassword: string }) {
		const { token, newPassword } = params;

		const { userId } = await this.otpService.verify(token);

		const user = await User.find(userId);
		if (!user) throw new InvalidTokenException();

		await this.otpService.revoke(`user:${user.id}:onboarding`);
		await user.merge({ password: newPassword, activatedAt: DateTime.now() }).save();
		await this.ctx.auth.use("client").login(user);

		return user;
	}
}
