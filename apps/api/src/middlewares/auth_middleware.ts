import type { Authenticators } from "@adonisjs/auth/types";
import type { HttpContext } from "@adonisjs/core/http";
import type { NextFn } from "@adonisjs/core/types/http";

import UnauthenticatedException from "#exceptions/unauthenticated.exception";
import { authVersionSessionKey } from "#services/auth_session.service";

export default class AuthMiddleware {
	async handle(
		ctx: HttpContext,
		next: NextFn,
		options: {
			guards?: (keyof Authenticators)[];
		} = {},
	) {
		const [guard = ctx.auth.defaultGuard] = options.guards || [ctx.auth.defaultGuard];
		await ctx.auth.authenticateUsing([guard]);
		const user = ctx.auth.user!;
		const sessionKey = authVersionSessionKey(guard);
		const authVersion = ctx.session.get(sessionKey);

		if (
			user.status !== "active" ||
			(authVersion !== undefined && authVersion !== user.authVersion)
		) {
			await ctx.auth.use(guard).logout();
			throw new UnauthenticatedException();
		}

		if (authVersion === undefined) {
			ctx.session.put(sessionKey, user.authVersion);
		}

		return next();
	}
}
