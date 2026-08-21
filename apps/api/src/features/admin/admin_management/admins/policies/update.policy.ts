import { BasePolicy } from "@adonisjs/bouncer";

export default class UpdateAdminPolicy extends BasePolicy {
	handle() {
		return true;
	}
}
