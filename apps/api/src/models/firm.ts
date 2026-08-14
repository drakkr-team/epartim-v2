import { BaseModel, belongsTo, column, hasMany } from "@adonisjs/lucid/orm";
import type { BelongsTo, HasMany } from "@adonisjs/lucid/types/relations";
import { DateTime } from "luxon";

import Network from "#models/network";
import User from "#models/user";

export default class Firm extends BaseModel {
	@column({ isPrimary: true })
	declare id: number;

	@column()
	declare name: string;

	@column()
	declare networkId: number | null;

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime;

	@belongsTo(() => Network)
	declare network: BelongsTo<typeof Network>;

	@hasMany(() => User)
	declare users: HasMany<typeof User>;
}
