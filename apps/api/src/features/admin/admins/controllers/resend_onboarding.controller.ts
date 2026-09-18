import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";

import AdminOnboardingService from "#features/admin/account_management/onboarding/services/onboarding.service";
import ResendAdminOnboardingPolicy from "#features/admin/admins/policies/resend_onboarding.policy";
import Admin from "#models/admin";

@inject()
export default class ResendAdminOnboardingController {
	constructor(protected onboardingService: AdminOnboardingService) {}

	async handle({ params, response, bouncer }: HttpContext) {
		const { adminId } = params;

		const admin = await Admin.findOrFail(adminId);

		await bouncer.with(ResendAdminOnboardingPolicy).authorize("handle", admin);

		await this.onboardingService.send(admin);

		return response.noContent();
	}
}
