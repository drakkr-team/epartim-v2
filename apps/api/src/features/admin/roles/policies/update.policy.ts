import { BasePolicy } from "@adonisjs/bouncer";

import Admin from "#models/admin";
import Role from "#models/role";
import User from "#models/user";

export default class UpdateRolePolicy extends BasePolicy {
	async handle(currentUser: Admin | User, role: Role) {
		if (currentUser instanceof User) return false;

		return !role.isSuperAdmin && currentUser.can("update:role");
	}
}
