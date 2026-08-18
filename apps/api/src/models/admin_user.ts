import { withAuthFinder } from "@adonisjs/auth/mixins/lucid";
import { compose } from "@adonisjs/core/helpers";
import hash from "@adonisjs/core/services/hash";
import { column } from "@adonisjs/lucid/orm";
import { DateTime } from "luxon";

import { AdminUserSchema } from "#database/schema";

const authFinder = withAuthFinder(() => hash.use("scrypt"), {
	uids: ["email"],
	passwordColumnName: "password",
});

export const ADMIN_USER_STATUSES = ["active", "disabled"] as const;

export type AdminUserStatus = (typeof ADMIN_USER_STATUSES)[number];

export default class AdminUser extends compose(AdminUserSchema, authFinder) {
	@column()
	declare status: AdminUserStatus;

	@column.dateTime()
	declare disabledAt: DateTime | null;

	@column()
	declare authVersion: number;

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime;
}
