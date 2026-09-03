import { hasMany } from "@adonisjs/lucid/orm";
import type { HasMany } from "@adonisjs/lucid/types/relations";

import { AddressSchema } from "#database/schema";
import Network from "#models/network";

export default class Address extends AddressSchema {
	@hasMany(() => Network)
	declare networks: HasMany<typeof Network>;
}
