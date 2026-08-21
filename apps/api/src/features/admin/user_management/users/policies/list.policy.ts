import { BasePolicy } from "@adonisjs/bouncer";

export default class ListUsersPolicy extends BasePolicy {
	handle() {
		return true;
	}
}
