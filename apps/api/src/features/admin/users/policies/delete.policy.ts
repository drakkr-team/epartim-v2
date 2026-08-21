import { BasePolicy } from "@adonisjs/bouncer";

import Admin from "#models/admin";
import User from "#models/user";

export default class DeleteUserPolicy extends BasePolicy {
	handle(currentUser: Admin | User, _userId: number | string) {
		return currentUser instanceof Admin;
	}
}
