import { BasePolicy } from "@adonisjs/bouncer";

import Admin from "#models/admin";
import Role from "#models/role";
import User from "#models/user";

export default class CreateRolePolicy extends BasePolicy {
	async handle(currentUser: Admin | User) {
		if (currentUser instanceof User) return false;

		const role = await Role.find(currentUser.roleId);

		return role?.isSuperAdmin ?? false;
	}
}
