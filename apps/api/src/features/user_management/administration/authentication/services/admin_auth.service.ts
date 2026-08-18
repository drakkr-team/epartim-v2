import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";

import InvalidCredentialsException from "#features/user_management/authentication/exceptions/invalid_credentials.exception";
import AdminUser from "#models/admin_user";
import { authVersionSessionKey } from "#services/auth_session.service";

@inject()
export default class AdminAuthService {
	constructor(protected ctx: HttpContext) {}

	async login(params: { uid: string; password: string }) {
		const user = await AdminUser.verifyCredentials(params.uid, params.password);
		if (user.status !== "active") throw new InvalidCredentialsException();

		await this.ctx.auth.use("admin").login(user);
		this.ctx.session.put(authVersionSessionKey("admin"), user.authVersion);

		return user;
	}

	async logout() {
		await this.ctx.auth.use("admin").logout();
	}
}
