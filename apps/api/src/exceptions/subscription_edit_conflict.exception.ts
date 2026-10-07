import { Exception } from "@adonisjs/core/exceptions";

export default class SubscriptionEditConflictException extends Exception {
	static status = 409;
	static code = "E_SUBSCRIPTION_EDIT_CONFLICT";
	static message = "The subscription has changed or is being edited. Reload it before retrying.";
}
