import { BasePolicy } from "@adonisjs/bouncer";

import Admin from "#models/admin";
import Subscription from "#models/subscription";
import User from "#models/user";

export default class SubscriptionAccessPolicy extends BasePolicy {
	handle(currentUser: Admin | User, subscription: Subscription) {
		return currentUser instanceof User && subscription.createdBy === currentUser.id;
	}
}
