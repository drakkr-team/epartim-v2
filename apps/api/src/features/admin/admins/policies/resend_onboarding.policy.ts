import { BasePolicy } from "@adonisjs/bouncer";

import Admin from "#models/admin";
import User from "#models/user";

export default class ResendAdminOnboardingPolicy extends BasePolicy {
	async handle(currentUser: Admin | User, admin: Admin) {
		if (currentUser instanceof User) return false;
		if (admin.activatedAt !== null) return false;

		return currentUser.can("create:admin");
	}
}
