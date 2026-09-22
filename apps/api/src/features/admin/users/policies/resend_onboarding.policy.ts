import { BasePolicy } from "@adonisjs/bouncer";

import Admin from "#models/admin";
import User from "#models/user";

export default class ResendUserOnboardingPolicy extends BasePolicy {
	async handle(currentUser: Admin | User, user: User) {
		if (currentUser instanceof User) return false;
		if (user.activatedAt !== null) return false;

		return currentUser.can("create:user");
	}
}
