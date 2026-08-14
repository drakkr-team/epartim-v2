import type { HttpContext } from "@adonisjs/core/http";
import type { NextFn } from "@adonisjs/core/types/http";
import limiter from "@adonisjs/limiter/services/main";

const attemptsLimiter = limiter.use({ requests: 10, duration: "1 minute" });

export default class AuthAttemptLimiterMiddleware {
	async handle(
		ctx: HttpContext,
		next: NextFn,
		options: {
			identifier: "email" | "uid" | "token";
			scope: "login" | "password-forgot" | "password-reset";
		},
	) {
		const identifier = String(ctx.request.input(options.identifier) || "")
			.trim()
			.toLowerCase();

		await attemptsLimiter.consume(`${options.scope}:ip:${ctx.request.ip()}`);
		await attemptsLimiter.consume(`${options.scope}:identifier:${identifier}`);

		return next();
	}
}
