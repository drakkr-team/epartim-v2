import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";

import AdminUserPresenter from "#presenters/admin_user.presenter";

@inject()
export default class ViewCurrentUserController {
	constructor(private adminUserPresenter: AdminUserPresenter) {}

	async handle({ auth }: HttpContext) {
		return this.adminUserPresenter.toJSON(auth.use("admin").user!);
	}
}
