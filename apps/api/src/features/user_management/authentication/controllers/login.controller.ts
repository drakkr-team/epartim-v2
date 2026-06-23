import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import LoginPolicy from "#features/user_management/authentication/policies/login.policy";
import AuthService from "#features/user_management/authentication/services/auth.service";
import UserPresenter from "#presenters/user.presenter";

@inject()
export default class LoginController {
	constructor(
		protected authService: AuthService,
		protected userPresenter: UserPresenter,
	) {}

	async handle({ request, bouncer }: HttpContext) {
		await bouncer.with(LoginPolicy).authorize("handle");

		const { uid, password } = await request.validateUsing(LoginController.payloadSchema);

		const user = await this.authService.login({ uid, password });

		return this.userPresenter.toJSON(user);
	}

	static payloadSchema = vine.create({
		uid: vine.string(),
		password: vine.string(),
	});
}
