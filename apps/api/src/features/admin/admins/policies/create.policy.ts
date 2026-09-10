import { BasePolicy } from "@adonisjs/bouncer";

import Admin from "#models/admin";
import User from "#models/user";

export default class CreateAdminPolicy extends BasePolicy {
	async handle(currentUser: Admin | User) {
		if (currentUser instanceof User) return false;

		return currentUser.can("create:admin");
	}
}
