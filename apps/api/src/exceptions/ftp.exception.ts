import { Exception } from "@adonisjs/core/exceptions";

export default class FtpException extends Exception {
	static status = 500;
	static code = "E_FTP";
	static message = "An error occurred during the FTP transaction";
}
