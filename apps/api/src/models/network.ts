import { BaseModel, column, hasMany } from "@adonisjs/lucid/orm";
import type { HasMany } from "@adonisjs/lucid/types/relations";
import { DateTime } from "luxon";

import Firm from "#models/firm";

export default class Network extends BaseModel {
	@column({ isPrimary: true })
	declare id: number;

	@column()
	declare name: string;

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime;

	@hasMany(() => Firm)
	declare firms: HasMany<typeof Firm>;
}
