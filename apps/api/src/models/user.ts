import { withAuthFinder } from "@adonisjs/auth/mixins/lucid";
import { compose } from "@adonisjs/core/helpers";
import hash from "@adonisjs/core/services/hash";
import { belongsTo, hasMany } from "@adonisjs/lucid/orm";
import type { BelongsTo, HasMany } from "@adonisjs/lucid/types/relations";

import { USER_ROLES, type UserRole } from "#constants/user";
import { UserSchema } from "#database/schema";
import Firm from "#models/firm";
import Subscription from "#models/subscription";

const authFinder = withAuthFinder(() => hash.use("scrypt"), {
	uids: ["email"],
	passwordColumnName: "password",
});

export default class User extends compose(UserSchema, authFinder) {
	declare role: UserRole;

	@belongsTo(() => Firm)
	declare firm: BelongsTo<typeof Firm>;

	@hasMany(() => Subscription, { foreignKey: "createdBy" })
	declare subscriptions: HasMany<typeof Subscription>;

	async can(action: "list:subscription" | "create:subscription"): Promise<boolean>;
	async can(action: "access:subscription", subscription: Subscription): Promise<boolean>;
	async can(
		action: "list:subscription" | "create:subscription" | "access:subscription",
		subscription?: Subscription,
	): Promise<boolean> {
		if (!Object.values(USER_ROLES).includes(this.role)) return false;

		switch (action) {
			case "list:subscription":
			case "create:subscription":
				return true;
			case "access:subscription":
				return (
					!!subscription &&
					!!(await Subscription.query()
						.select("id")
						.apply((scopes) => scopes.accessibleTo(this))
						.where("subscriptions.id", subscription.id)
						.first())
				);
			default:
				return false;
		}
	}

	get name() {
		return `${this.firstName} ${this.lastName}`;
	}
}
