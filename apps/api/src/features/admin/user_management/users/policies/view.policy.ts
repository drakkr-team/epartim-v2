import { BasePolicy } from "@adonisjs/bouncer";

export default class ViewUserPolicy extends BasePolicy {
	handle() {
		return true;
	}
}
