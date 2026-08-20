import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";

import AdminUserService from "#features/admin/users/services/admin_user.service";

@inject()
export default class CancelInvitationController {
	constructor(private adminUserService: AdminUserService) {}

	async handle({ request }: HttpContext) {
		const user = await this.adminUserService.find(Number(request.param("id")));
		await this.adminUserService.cancelInvitation(user);
		return null;
	}
}
