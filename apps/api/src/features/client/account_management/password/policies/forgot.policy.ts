import { allowGuest, BasePolicy } from "@adonisjs/bouncer";

export default class ForgotPolicy extends BasePolicy {
	@allowGuest()
	async handle() {
		return true;
	}
}
