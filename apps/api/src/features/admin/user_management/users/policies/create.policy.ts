import { BasePolicy } from "@adonisjs/bouncer";

export default class CreateUserPolicy extends BasePolicy {
	handle() {
		return true;
	}
}
