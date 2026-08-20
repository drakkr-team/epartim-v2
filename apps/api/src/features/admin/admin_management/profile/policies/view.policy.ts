import { BasePolicy } from "@adonisjs/bouncer";

export default class ViewProfilePolicy extends BasePolicy {
	async handle() {
		return true;
	}
}
