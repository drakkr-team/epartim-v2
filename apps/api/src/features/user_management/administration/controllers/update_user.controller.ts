import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import AdminUserService from "#features/user_management/administration/services/admin_user.service";
import { AdminUserInputSchema } from "#features/user_management/administration/validators/admin_user.validator";
import UserPresenter from "#presenters/user.presenter";

@inject()
export default class UpdateUserController {
	constructor(
		private adminUserService: AdminUserService,
		private userPresenter: UserPresenter,
	) {}

	async handle({ request, auth }: HttpContext) {
		const payload = await request.validateUsing(UpdateUserController.payloadSchema);
		const user = await this.adminUserService.find(Number(request.param("id")));
		await this.adminUserService.update(user, payload, auth.user!);
		return this.userPresenter.toJSON(user);
	}

	static payloadSchema = vine.create(AdminUserInputSchema);
}
