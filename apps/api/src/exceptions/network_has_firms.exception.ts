import { Exception } from "@adonisjs/core/exceptions";

export default class NetworkHasFirmsException extends Exception {
	static status = 409;
	static code = "E_NETWORK_HAS_FIRMS";
	static message = "Le réseau ne peut pas être supprimé car des cabinets y font référence.";
}
