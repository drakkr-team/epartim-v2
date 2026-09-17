import { Exception } from "@adonisjs/core/exceptions";

export default class InvalidDocumentTypeException extends Exception {
	static status = 422;
	static code = "E_INVALID_DOCUMENT_TYPE";
	static message = "The document type is not supported.";
}
