import { Exception } from "@adonisjs/core/exceptions";

export default class InpiDocumentUnavailableException extends Exception {
	static status = 422;
	static code = "E_INPI_DOCUMENT_UNAVAILABLE";
	static message = "The INPI document is unavailable or is not a supported PDF.";
}
