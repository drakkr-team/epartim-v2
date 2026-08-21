import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";

import Admin from "#models/admin";

@inject()
export default class AuthService {
	constructor(protected ctx: HttpContext) {}

	async login(params: { uid: string; password: string }) {
		const { uid, password } = params;

		const admin = await Admin.verifyCredentials(uid, password);
		await this.ctx.auth.use("admin").login(admin);

		return admin;
	}

	async logout() {
		await this.ctx.auth.use("admin").logout();
	}
}
