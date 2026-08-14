import type { HttpContext } from "@adonisjs/core/http";
import type { NextFn } from "@adonisjs/core/types/http";

import UnauthenticatedException from "#exceptions/unauthenticated.exception";

export default class AdminMiddleware {
	async handle(ctx: HttpContext, next: NextFn) {
		const user = ctx.auth.user!;
		const administratorRole = await user
			.related("roles")
			.query()
			.where("code", "administrator")
			.first();

		if (!administratorRole) {
			throw new UnauthenticatedException();
		}

		return next();
	}
}
