import { BasePolicy } from "@adonisjs/bouncer";

export default class LogoutPolicy extends BasePolicy {
	handle() {
		return true;
	}
}
