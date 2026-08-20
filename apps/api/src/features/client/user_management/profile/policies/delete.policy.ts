import { BasePolicy } from "@adonisjs/bouncer";

export default class DeleteProfilePolicy extends BasePolicy {
	async handle() {
		return true;
	}
}
