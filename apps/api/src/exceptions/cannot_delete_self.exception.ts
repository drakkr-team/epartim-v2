import { Exception } from "@adonisjs/core/exceptions";

export default class CannotDeleteSelfException extends Exception {
	static status = 403;
	static code = "E_CANNOT_DELETE_SELF";
	static message = "You cannot delete your own admin account.";
}
