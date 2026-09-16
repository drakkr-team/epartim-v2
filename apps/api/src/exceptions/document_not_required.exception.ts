import { Exception } from "@adonisjs/core/exceptions";

export default class DocumentNotRequiredException extends Exception {
	static status = 422;
	static code = "E_DOCUMENT_NOT_REQUIRED";
	static message = "The document is not currently required for this subscription.";
}
