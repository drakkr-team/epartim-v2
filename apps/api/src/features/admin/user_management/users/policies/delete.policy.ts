import { BasePolicy } from "@adonisjs/bouncer";

import Admin from "#models/admin";
import User from "#models/user";

export default class DeleteUserPolicy extends BasePolicy {
	handle(_authenticatedAccount: Admin | User, _targetUser: User) {
		return true;
	}
}
