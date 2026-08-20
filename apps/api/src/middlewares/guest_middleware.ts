import type { Authenticators } from "@adonisjs/auth/types";
import type { HttpContext } from "@adonisjs/core/http";
import type { NextFn } from "@adonisjs/core/types/http";

import GuestOnlyException from "#exceptions/guest_only.exception";

export default class GuestMiddleware {
	async handle(
		ctx: HttpContext,
		next: NextFn,
		options: { guards?: (keyof Authenticators)[] } = {},
	) {
		for (const guard of options.guards || [ctx.auth.defaultGuard]) {
			if (await ctx.auth.use(guard).check()) {
				throw new GuestOnlyException();
			}
		}

		return next();
	}
}
