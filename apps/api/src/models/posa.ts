import { belongsTo, column } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";

import type { PosaDeviceType, PosaFund } from "#constants/posa";
import { PosaSchema } from "#database/schema";
import Company from "#models/company";

export default class Posa extends PosaSchema {
	@column()
	declare deviceType: PosaDeviceType;

	@column()
	declare fund: PosaFund;

	@belongsTo(() => Company)
	declare company: BelongsTo<typeof Company>;
}
