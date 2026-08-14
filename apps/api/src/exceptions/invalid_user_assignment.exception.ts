import { Exception } from "@adonisjs/core/exceptions";

export default class InvalidUserAssignmentException extends Exception {
	static status = 422;
	static code = "E_INVALID_USER_ASSIGNMENT";
	static message = "The role and commercial assignment are inconsistent.";
}
