import { BasePolicy } from "@adonisjs/bouncer";

export default class CreateAdminPolicy extends BasePolicy {
	handle() {
		return true;
	}
}
