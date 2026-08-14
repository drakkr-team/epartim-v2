import { Exception } from "@adonisjs/core/exceptions";

export default class ForbiddenUserOperationException extends Exception {
	static status = 403;
	static code = "E_FORBIDDEN_USER_OPERATION";
	static message = "This operation is not allowed for this user.";
}
