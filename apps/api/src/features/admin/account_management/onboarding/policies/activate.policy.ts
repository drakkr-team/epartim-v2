import { allowGuest, BasePolicy } from "@adonisjs/bouncer";

export default class ActivatePolicy extends BasePolicy {
	@allowGuest()
	handle() {
		return true;
	}
}
