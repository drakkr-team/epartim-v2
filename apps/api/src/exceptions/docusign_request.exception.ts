import { Exception } from "@adonisjs/core/exceptions";

export default class DocusignRequestException extends Exception {
	static status = 500;
	static code = "E_DOCUSIGN_REQUEST";
	static message = "Docusign request failed";
}
