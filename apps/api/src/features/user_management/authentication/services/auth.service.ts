import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";

import User from "#models/user";

@inject()
export default class AuthService {
	constructor(protected ctx: HttpContext) {}

	async login(params: { uid: string; password: string }) {
		const { uid, password } = params;

		const user = await User.verifyCredentials(uid, password);
		await this.ctx.auth.use("web").login(user);

		return user;
	}

	async logout() {
		await this.ctx.auth.use("web").logout();
	}
}
