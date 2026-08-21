import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import LoginPolicy from "#features/admin/admin_management/authentication/policies/login.policy";
import AuthService from "#features/admin/admin_management/authentication/services/auth.service";
import AdminPresenter from "#presenters/admin.presenter";

@inject()
export default class LoginController {
	constructor(
		protected authService: AuthService,
		protected adminPresenter: AdminPresenter,
	) {}

	async handle({ request, bouncer }: HttpContext) {
		await bouncer.with(LoginPolicy).authorize("handle");

		const { uid, password } = await request.validateUsing(LoginController.payloadSchema);

		const admin = await this.authService.login({ uid, password });

		return this.adminPresenter.toJSON(admin);
	}

	static payloadSchema = vine.create({
		uid: vine.string(),
		password: vine.string(),
	});
}
