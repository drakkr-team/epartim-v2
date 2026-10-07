import { Exception } from "@adonisjs/core/exceptions";

export default class InpiPreviewExpiredException extends Exception {
	static status = 409;
	static code = "E_INPI_PREVIEW_EXPIRED";
	static message = "The INPI preview has expired or the subscription has changed.";
}
