import { BasePolicy } from "@adonisjs/bouncer";

import Admin from "#models/admin";
import User from "#models/user";

export default class ListNetworksPolicy extends BasePolicy {
	handle(currentUser: Admin | User) {
		return currentUser instanceof Admin;
	}
}
