import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";

import AdminUserService from "#features/user_management/administration/services/admin_user.service";

@inject()
export default class ReactivateUserController {
	constructor(private adminUserService: AdminUserService) {}

	async handle({ request }: HttpContext) {
		const user = await this.adminUserService.find(Number(request.param("id")));
		await this.adminUserService.reactivate(user);
		return null;
	}
}
