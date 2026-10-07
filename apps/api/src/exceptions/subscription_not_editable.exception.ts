import { Exception } from "@adonisjs/core/exceptions";

export default class SubscriptionNotEditableException extends Exception {
	static status = 409;
	static code = "E_SUBSCRIPTION_NOT_EDITABLE";
	static message = "This subscription can no longer be prefilled.";
}
