import { BasePolicy } from "@adonisjs/bouncer";

import CannotDeleteSelfException from "#exceptions/cannot_delete_self.exception";
import Admin from "#models/admin";
import User from "#models/user";

export default class DeleteAdminPolicy extends BasePolicy {
	handle(authenticatedAccount: Admin | User, targetAdmin: Admin) {
		if (authenticatedAccount.id === targetAdmin.id) {
			throw new CannotDeleteSelfException();
		}

		return true;
	}
}
