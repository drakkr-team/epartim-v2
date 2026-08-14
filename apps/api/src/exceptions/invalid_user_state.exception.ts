import { Exception } from "@adonisjs/core/exceptions";

export default class InvalidUserStateException extends Exception {
	static status = 422;
	static code = "E_INVALID_USER_STATE";
	static message = "The user is not in a state that allows this action.";
}
