import { withAuthFinder } from "@adonisjs/auth/mixins/lucid";
import { compose } from "@adonisjs/core/helpers";
import hash from "@adonisjs/core/services/hash";
import { column, hasMany } from "@adonisjs/lucid/orm";
import type { HasMany } from "@adonisjs/lucid/types/relations";

import { UserSchema } from "#database/schema";
import Subscription from "#models/subscription";

const authFinder = withAuthFinder(() => hash.use("scrypt"), {
	uids: ["email"],
	passwordColumnName: "password",
});

export default class User extends compose(UserSchema, authFinder) {
	@column({ isPrimary: true })
	declare id: number;

	@hasMany(() => Subscription, { foreignKey: "createdBy" })
	declare subscriptions: HasMany<typeof Subscription>;

	get name() {
		return `${this.firstName} ${this.lastName}`;
	}
}
