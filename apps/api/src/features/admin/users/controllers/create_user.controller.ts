import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import AdminUserService from "#features/admin/users/services/admin_user.service";
import { CreateAdminUserSchema } from "#features/admin/users/validators/admin_user.validator";
import UserPresenter from "#presenters/user.presenter";

@inject()
export default class CreateUserController {
	constructor(
		private adminUserService: AdminUserService,
		private userPresenter: UserPresenter,
	) {}

	async handle({ request, auth }: HttpContext) {
		const payload = await request.validateUsing(CreateUserController.payloadSchema);
		const user = await this.adminUserService.create(payload, auth.user!);
		return this.userPresenter.toJSON(user);
	}

	static payloadSchema = vine.create(CreateAdminUserSchema);
}
