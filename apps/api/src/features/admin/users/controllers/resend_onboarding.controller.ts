import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";

import ResendUserOnboardingPolicy from "#features/admin/users/policies/resend_onboarding.policy";
import UserOnboardingService from "#features/client/account_management/onboarding/services/onboarding.service";
import User from "#models/user";

@inject()
export default class ResendUserOnboardingController {
	constructor(protected onboardingService: UserOnboardingService) {}

	async handle({ params, response, bouncer }: HttpContext) {
		const { userId } = params;

		const user = await User.findOrFail(userId);

		await bouncer.with(ResendUserOnboardingPolicy).authorize("handle", user);

		await this.onboardingService.send(user);

		return response.noContent();
	}
}
