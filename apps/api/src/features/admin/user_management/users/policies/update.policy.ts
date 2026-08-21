import { BasePolicy } from "@adonisjs/bouncer";

export default class UpdateUserPolicy extends BasePolicy {
	handle() {
		return true;
	}
}
