import type { Authenticators } from "@adonisjs/auth/types";
import type { HttpContext } from "@adonisjs/core/http";
import type { NextFn } from "@adonisjs/core/types/http";

import UnauthenticatedException from "#exceptions/unauthenticated.exception";

export default class AuthMiddleware {
	async handle(
		ctx: HttpContext,
		next: NextFn,
		options: {
			guards?: (keyof Authenticators)[];
		} = {},
	) {
		await ctx.auth.authenticateUsing(options.guards);
		const user = ctx.auth.user!;
		const authVersion = ctx.session.get("authVersion");

		if (
			user.status !== "active" ||
			(authVersion !== undefined && authVersion !== user.authVersion)
		) {
			await ctx.auth.use("web").logout();
			throw new UnauthenticatedException();
		}

		if (authVersion === undefined) {
			ctx.session.put("authVersion", user.authVersion);
		}

		return next();
	}
}
