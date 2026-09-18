import type { HttpContext } from "@adonisjs/core/http";
import type { NextFn } from "@adonisjs/core/types/http";
import SuperjsonMiddleware from "@tuyau/superjson/superjson_middleware";

export default class MultipartSafeSuperjsonMiddleware {
	#superjsonMiddleware = new SuperjsonMiddleware();

	async handle(ctx: HttpContext, next: NextFn) {
		if (ctx.request.header("content-type")?.startsWith("multipart/form-data")) {
			return next();
		}

		return this.#superjsonMiddleware.handle(ctx, next);
	}
}
