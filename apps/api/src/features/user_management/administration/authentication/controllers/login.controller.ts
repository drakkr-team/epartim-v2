import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import AdminAuthService from "#features/user_management/administration/authentication/services/admin_auth.service";
import AdminUserPresenter from "#presenters/admin_user.presenter";

@inject()
export default class LoginController {
	constructor(
		private adminAuthService: AdminAuthService,
		private adminUserPresenter: AdminUserPresenter,
	) {}

	async handle({ request }: HttpContext) {
		const { uid, password } = await request.validateUsing(LoginController.payloadSchema);
		const user = await this.adminAuthService.login({ uid, password });

		return this.adminUserPresenter.toJSON(user);
	}

	static payloadSchema = vine.create({
		uid: vine.string(),
		password: vine.string(),
	});
}
