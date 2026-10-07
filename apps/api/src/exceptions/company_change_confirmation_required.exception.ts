import { Exception } from "@adonisjs/core/exceptions";

export default class CompanyChangeConfirmationRequiredException extends Exception {
	static status = 409;
	static code = "E_COMPANY_CHANGE_CONFIRMATION_REQUIRED";
	static message = "Changing the company requires confirmation.";
}
