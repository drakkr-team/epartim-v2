import type { Authenticators } from "@adonisjs/auth/types";
import type { HttpContext } from "@adonisjs/core/http";
import type { NextFn } from "@adonisjs/core/types/http";

import GuestOnlyException from "#exceptions/guest_only.exception";
import User from "#models/user";

export default class GuestMiddleware {
	async handle(
		ctx: HttpContext,
		next: NextFn,
		options: { guards?: (keyof Authenticators)[] } = {},
	) {
		for (const guard of options.guards || [ctx.auth.defaultGuard]) {
			const authGuard = ctx.auth.use(guard);

			if (await authGuard.check()) {
				const user = authGuard.user!;

				if (!(user instanceof User)) {
					throw new GuestOnlyException();
				}

				const authVersion = ctx.session.get("authVersion");
				if (
					user.status === "active" &&
					(authVersion === undefined || authVersion === user.authVersion)
				) {
					throw new GuestOnlyException();
				}

				await authGuard.logout();
			}
		}

		return next();
	}
}
