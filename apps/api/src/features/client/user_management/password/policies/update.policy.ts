import { BasePolicy } from "@adonisjs/bouncer";

export default class UpdatePolicy extends BasePolicy {
	async handle() {
		return true;
	}
}
