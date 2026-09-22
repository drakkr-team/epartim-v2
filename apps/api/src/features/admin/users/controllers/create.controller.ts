import { inject } from "@adonisjs/core";
import stringHelpers from "@adonisjs/core/helpers/string";
import { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import CreateUserPolicy from "#features/admin/users/policies/create.policy";
import UserOnboardingService from "#features/client/account_management/onboarding/services/onboarding.service";
import User from "#models/user";
import UserPresenter from "#presenters/user.presenter";
import { CreateUserSchema } from "#validators/user.validator";

@inject()
export default class CreateUserController {
	constructor(
		protected onboardingService: UserOnboardingService,
		protected userPresenter: UserPresenter,
	) {}

	async handle({ request, response, bouncer }: HttpContext) {
		await bouncer.with(CreateUserPolicy).authorize("handle");

		const payload = await request.validateUsing(CreateUserController.payloadSchema);

		const user = await User.create({
			...payload,
			password: stringHelpers.generateRandom(32),
		});
		await this.onboardingService.send(user);

		return response.created(this.userPresenter.toJSON(user));
	}

	static payloadSchema = vine.create(CreateUserSchema);
}
