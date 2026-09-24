import { withAuthFinder } from "@adonisjs/auth/mixins/lucid";
import { compose } from "@adonisjs/core/helpers";
import hash from "@adonisjs/core/services/hash";
import { belongsTo, hasMany } from "@adonisjs/lucid/orm";
import type { BelongsTo, HasMany } from "@adonisjs/lucid/types/relations";

import type { UserRole } from "#constants/user";
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

	get name() {
		return `${this.firstName} ${this.lastName}`;
	}
}
