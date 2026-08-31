import { Exception } from "@adonisjs/core/exceptions";

export default class NetworkValidationException extends Exception {
	static status = 422;
	static code = "E_NETWORK_VALIDATION_ERROR";
	static message = "The network payload is invalid.";
}
