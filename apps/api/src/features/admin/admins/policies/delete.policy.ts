import { BasePolicy } from "@adonisjs/bouncer";

import Admin from "#models/admin";
import User from "#models/user";

export default class DeleteAdminPolicy extends BasePolicy {
	async handle(currentUser: Admin | User, adminId: number | string) {
		if (currentUser instanceof User) return false;
		if (currentUser.id.toString() === adminId.toString()) return false;

		return currentUser.can("delete:admin");
	}
}
