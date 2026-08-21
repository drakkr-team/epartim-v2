import { BasePolicy } from "@adonisjs/bouncer";

import Admin from "#models/admin";
import User from "#models/user";

export default class DeleteAdminPolicy extends BasePolicy {
	handle(currentUser: Admin | User, adminId: number) {
		if (currentUser instanceof User) return false;

		return currentUser.id !== adminId;
	}
}
