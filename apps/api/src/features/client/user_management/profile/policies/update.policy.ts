import { BasePolicy } from "@adonisjs/bouncer";

export default class UpdateProfilePolicy extends BasePolicy {
	async handle() {
		return true;
	}
}
