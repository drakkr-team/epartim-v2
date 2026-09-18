import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import ActivatePolicy from "#features/admin/account_management/onboarding/policies/activate.policy";
import AdminOnboardingService from "#features/admin/account_management/onboarding/services/onboarding.service";
import { UserPasswordValidator } from "#validators/user.validator";

@inject()
export default class ActivateAdminOnboardingController {
	constructor(protected onboardingService: AdminOnboardingService) {}

	async handle({ request, response, bouncer }: HttpContext) {
		await bouncer.with(ActivatePolicy).authorize("handle");

		const { token, newPassword } = await request.validateUsing(
			ActivateAdminOnboardingController.payloadSchema,
		);

		await this.onboardingService.activate({
			token,
			newPassword,
		});

		return response.noContent();
	}

	static payloadSchema = vine.create({
		token: vine.string(),
		newPassword: UserPasswordValidator,
	});
}
``;
