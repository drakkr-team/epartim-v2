import { BasePolicy } from "@adonisjs/bouncer";

export default class ListAdminsPolicy extends BasePolicy {
	handle() {
		return true;
	}
}
