import { inject } from "@adonisjs/core";
import stringHelpers from "@adonisjs/core/helpers/string";
import { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import AdminOnboardingService from "#features/admin/account_management/onboarding/services/onboarding.service";
import CreateAdminPolicy from "#features/admin/admins/policies/create.policy";
import Admin from "#models/admin";
import AdminPresenter from "#presenters/admin.presenter";
import { CreateAdminSchema } from "#validators/admin.validator";

@inject()
export default class CreateAdminController {
	constructor(
		protected onboardingService: AdminOnboardingService,
		protected adminPresenter: AdminPresenter,
	) {}

	async handle({ request, response, bouncer }: HttpContext) {
		await bouncer.with(CreateAdminPolicy).authorize("handle");

		const payload = await request.validateUsing(CreateAdminController.payloadSchema);

		const admin = await Admin.create({
			...payload,
			password: stringHelpers.generateRandom(32),
		});
		await this.onboardingService.send(admin);

		return response.created(this.adminPresenter.toJSON(admin));
	}

	static payloadSchema = vine.create(CreateAdminSchema);
}
