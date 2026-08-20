import { allowGuest, BasePolicy } from "@adonisjs/bouncer";

export default class LoginPolicy extends BasePolicy {
	@allowGuest()
	handle() {
		return true;
	}
}
