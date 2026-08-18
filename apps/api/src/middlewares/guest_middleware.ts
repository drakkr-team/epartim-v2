import type { Authenticators } from "@adonisjs/auth/types";
import type { HttpContext } from "@adonisjs/core/http";
import type { NextFn } from "@adonisjs/core/types/http";

import GuestOnlyException from "#exceptions/guest_only.exception";
import { authVersionSessionKey } from "#services/auth_session.service";

export default class GuestMiddleware {
	async handle(
		ctx: HttpContext,
		next: NextFn,
		options: { guards?: (keyof Authenticators)[] } = {},
	) {
		for (const guard of options.guards || [ctx.auth.defaultGuard]) {
			if (await ctx.auth.use(guard).check()) {
				const user = ctx.auth.user!;
				const authVersion = ctx.session.get(authVersionSessionKey(guard));
				if (
					user.status === "active" &&
					(authVersion === undefined || authVersion === user.authVersion)
				) {
					throw new GuestOnlyException();
				}

				await ctx.auth.use(guard).logout();
			}
		}

		return next();
	}
}
