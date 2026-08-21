import { BasePolicy } from "@adonisjs/bouncer";

export default class ViewAdminPolicy extends BasePolicy {
	handle() {
		return true;
	}
}
