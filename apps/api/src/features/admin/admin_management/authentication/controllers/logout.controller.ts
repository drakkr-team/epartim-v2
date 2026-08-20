import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";

import LogoutPolicy from "#features/admin/admin_management/authentication/policies/logout.policy";
import AuthService from "#features/admin/admin_management/authentication/services/auth.service";

@inject()
export default class LogoutController {
	constructor(protected authService: AuthService) {}

	async handle({ bouncer }: HttpContext) {
		await bouncer.with(LogoutPolicy).authorize("handle");

		await this.authService.logout();

		return null;
	}
}
