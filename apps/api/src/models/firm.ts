import { belongsTo } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";

import { FirmSchema } from "#database/schema";
import Address from "#models/address";
import Network from "#models/network";

export default class Firm extends FirmSchema {
	@belongsTo(() => Address)
	declare address: BelongsTo<typeof Address>;

	@belongsTo(() => Network)
	declare network: BelongsTo<typeof Network>;
}
