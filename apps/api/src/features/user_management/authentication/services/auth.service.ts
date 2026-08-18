import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";

import InvalidCredentialsException from "#features/user_management/authentication/exceptions/invalid_credentials.exception";
import User from "#models/user";
import { authVersionSessionKey } from "#services/auth_session.service";

@inject()
export default class AuthService {
	constructor(protected ctx: HttpContext) {}

	async login(params: { uid: string; password: string }) {
		const { uid, password } = params;

		const user = await User.verifyCredentials(uid, password);
		if (user.status !== "active") {
			throw new InvalidCredentialsException();
		}

		await this.ctx.auth.use("web").login(user);
		this.ctx.session.put(authVersionSessionKey("web"), user.authVersion);

		return user;
	}

	async logout() {
		await this.ctx.auth.use("web").logout();
	}
}
