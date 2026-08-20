import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";

import InvalidCredentialsException from "#exceptions/invalid_credentials.exception";
import User from "#models/user";

@inject()
export default class AuthService {
	constructor(protected ctx: HttpContext) {}

	async login(params: { uid: string; password: string; requireAdministrator?: boolean }) {
		const { uid, password } = params;

		const user = await User.verifyCredentials(uid, password);
		if (user.status !== "active") {
			throw new InvalidCredentialsException();
		}

		if (params.requireAdministrator) {
			const administratorRole = await user
				.related("roles")
				.query()
				.where("code", "administrator")
				.first();
			if (!administratorRole) {
				throw new InvalidCredentialsException();
			}
		}

		await this.ctx.auth.use("client").login(user);
		this.ctx.session.put("authVersion", user.authVersion);

		return user;
	}

	async logout() {
		await this.ctx.auth.use("client").logout();
	}
}
