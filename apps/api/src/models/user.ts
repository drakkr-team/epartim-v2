import { withAuthFinder } from "@adonisjs/auth/mixins/lucid";
import { compose } from "@adonisjs/core/helpers";
import hash from "@adonisjs/core/services/hash";
import { belongsTo, column, manyToMany } from "@adonisjs/lucid/orm";
import type { BelongsTo, ManyToMany } from "@adonisjs/lucid/types/relations";
import { DateTime } from "luxon";

import { UserSchema } from "#database/schema";
import Firm from "#models/firm";
import Network from "#models/network";
import Role from "#models/role";

const authFinder = withAuthFinder(() => hash.use("scrypt"), {
	uids: ["email"],
	passwordColumnName: "password",
});

export const USER_STATUSES = ["invited", "active", "disabled"] as const;

export type UserStatus = (typeof USER_STATUSES)[number];

export default class User extends compose(UserSchema, authFinder) {
	@column()
	declare firmId: number | null;

	@column()
	declare firstName: string | null;

	@column()
	declare lastName: string | null;

	@column()
	declare mobilePhone: string | null;

	@column()
	declare status: UserStatus;

	@column()
	declare amundiUserId: string | null;

	@column()
	declare amundiEmployeeType: string | null;

	@column()
	declare partnershipProvider: string | null;

	@column.dateTime()
	declare lastLoginAt: DateTime | null;

	@column.dateTime()
	declare disabledAt: DateTime | null;

	@column()
	declare authVersion: number;

	@column()
	declare networkId: number | null;

	@belongsTo(() => Firm)
	declare firm: BelongsTo<typeof Firm>;

	@belongsTo(() => Network)
	declare network: BelongsTo<typeof Network>;

	@manyToMany(() => Role, { pivotTable: "user_roles" })
	declare roles: ManyToMany<typeof Role>;
}
