import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";

import AdminAuthService from "#features/user_management/administration/authentication/services/admin_auth.service";

@inject()
export default class LogoutController {
	constructor(private adminAuthService: AdminAuthService) {}

	async handle(_: HttpContext) {
		await this.adminAuthService.logout();

		return null;
	}
}
