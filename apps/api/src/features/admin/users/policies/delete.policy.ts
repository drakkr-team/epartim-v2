import { BasePolicy } from "@adonisjs/bouncer";

import Admin from "#models/admin";
import User from "#models/user";

export default class DeleteUserPolicy extends BasePolicy {
	async handle(currentUser: Admin | User, _userId: number | string) {
		if (currentUser instanceof User) return false;

		return currentUser.can("delete:user");
	}
}
