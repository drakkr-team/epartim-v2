import { allowGuest, BasePolicy } from "@adonisjs/bouncer";

export default class ResetPolicy extends BasePolicy {
	@allowGuest()
	async handle() {
		return true;
	}
}
