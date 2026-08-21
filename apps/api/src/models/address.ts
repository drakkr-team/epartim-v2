import { hasMany, hasOne } from "@adonisjs/lucid/orm";
import type { HasMany, HasOne } from "@adonisjs/lucid/types/relations";

import { AddressSchema } from "#database/schema";
import Firm from "#models/firm";
import Network from "#models/network";

export default class Address extends AddressSchema {
	@hasOne(() => Firm)
	declare firm: HasOne<typeof Firm>;

	@hasMany(() => Network)
	declare networks: HasMany<typeof Network>;
}
