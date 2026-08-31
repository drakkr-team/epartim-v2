import { errors as authErrors } from "@adonisjs/auth";
import { ExceptionHandler, HttpContext } from "@adonisjs/core/http";
import app from "@adonisjs/core/services/app";
import type { HttpError } from "@adonisjs/core/types/http";
import { errors as limiterErrors } from "@adonisjs/limiter";

import GuestOnlyException from "#exceptions/guest_only.exception";
import InvalidCredentialsException from "#exceptions/invalid_credentials.exception";
import NetworkHasFirmsException from "#exceptions/network_has_firms.exception";
import TooManyRequestsException from "#exceptions/too_many_requests.exception";
import UnauthenticatedException from "#exceptions/unauthenticated.exception";

export default class HttpExceptionHandler extends ExceptionHandler {
	/**
	 * In debug mode, the exception handler will display verbose errors
	 * with pretty printed stack traces.
	 */
	protected debug = !app.inProduction;

	/**
	 * Status pages are used to display a custom HTML pages for certain error
	 * codes. You might want to enable them in production only, but feel
	 * free to enable them in development as well.
	 */
	protected renderStatusPages = app.inProduction;

	/**
	 * The method is used for handling errors and returning
	 * response to the client
	 */
	async handle(error: unknown, ctx: HttpContext) {
		if (error instanceof authErrors.E_INVALID_CREDENTIALS) {
			throw new InvalidCredentialsException();
		}

		if (error instanceof authErrors.E_UNAUTHORIZED_ACCESS) {
			throw new UnauthenticatedException();
		}

		if (error instanceof limiterErrors.E_TOO_MANY_REQUESTS) {
			throw new TooManyRequestsException();
		}

		if (error instanceof NetworkHasFirmsException) {
			return ctx.response.status(NetworkHasFirmsException.status).send({
				code: NetworkHasFirmsException.code,
				message: NetworkHasFirmsException.message,
			});
		}

		return super.handle(error, ctx);
	}

	/**
	 * The method is used to report error to the logging service or
	 * the a third party error monitoring service.
	 *
	 * @note You should not attempt to send a response from this method.
	 */
	async report(error: unknown, ctx: HttpContext) {
		return super.report(error, ctx);
	}

	protected shouldReport(error: HttpError) {
		if (error instanceof GuestOnlyException || error instanceof NetworkHasFirmsException) {
			return false;
		}

		return super.shouldReport(error);
	}
}
