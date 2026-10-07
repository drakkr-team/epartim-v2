import { Exception } from "@adonisjs/core/exceptions";

export default class DocumentReplacementConfirmationRequiredException extends Exception {
	static status = 409;
	static code = "E_DOCUMENT_REPLACEMENT_CONFIRMATION_REQUIRED";
	static message = "Replacing this document requires confirmation.";
}
