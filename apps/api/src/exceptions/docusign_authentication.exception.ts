import { Exception } from "@adonisjs/core/exceptions";

export default class DocusignAuthenticationException extends Exception {
	static status = 500;
	static code = "E_DOCUSIGN_AUTHENTICATION";
	static message = "Docusign authentication failed";
}
