import { belongsTo, hasMany } from "@adonisjs/lucid/orm";
import type { BelongsTo, HasMany } from "@adonisjs/lucid/types/relations";

import { NetworkSchema } from "#database/schema";
import Address from "#models/address";
import Firm from "#models/firm";

export default class Network extends NetworkSchema {
	@belongsTo(() => Address)
	declare address: BelongsTo<typeof Address>;

	@hasMany(() => Firm)
	declare firms: HasMany<typeof Firm>;
}
