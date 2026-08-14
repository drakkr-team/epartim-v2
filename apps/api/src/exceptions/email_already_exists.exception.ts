import { Exception } from "@adonisjs/core/exceptions";

export default class EmailAlreadyExistsException extends Exception {
	static status = 409;
	static code = "E_EMAIL_ALREADY_EXISTS";
	static message = "An account already uses this email address.";
}
