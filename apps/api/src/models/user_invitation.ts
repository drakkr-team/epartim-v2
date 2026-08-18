import { BaseModel, belongsTo, column } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";
import { DateTime } from "luxon";

import AdminUser from "#models/admin_user";
import User from "#models/user";

export default class UserInvitation extends BaseModel {
	@column({ isPrimary: true })
	declare id: number;

	@column()
	declare userId: number;

	@column()
	declare invitedByUserId: number | null;

	@column()
	declare invitedByAdminUserId: number | null;

	@column({ serializeAs: null })
	declare tokenHash: string;

	@column()
	declare email: string;

	@column.dateTime()
	declare sentAt: DateTime | null;

	@column.dateTime()
	declare expiresAt: DateTime;

	@column.dateTime()
	declare acceptedAt: DateTime | null;

	@column.dateTime()
	declare revokedAt: DateTime | null;

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime;

	@belongsTo(() => User)
	declare user: BelongsTo<typeof User>;

	@belongsTo(() => User, {
		foreignKey: "invitedByUserId",
	})
	declare invitedByUser: BelongsTo<typeof User>;

	@belongsTo(() => AdminUser)
	declare invitedByAdminUser: BelongsTo<typeof AdminUser>;
}
