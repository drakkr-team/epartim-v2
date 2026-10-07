import { Exception } from "@adonisjs/core/exceptions";

export default class InpiCompanyNotFoundException extends Exception {
	static status = 404;
	static code = "E_INPI_COMPANY_NOT_FOUND";
	static message = "The company could not be found in INPI.";
}
