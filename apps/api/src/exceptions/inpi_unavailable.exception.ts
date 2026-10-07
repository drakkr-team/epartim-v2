import { Exception } from "@adonisjs/core/exceptions";

export default class InpiUnavailableException extends Exception {
	static status = 503;
	static code = "E_INPI_UNAVAILABLE";
	static message = "INPI is temporarily unavailable.";
}
