import { belongsTo, hasOne } from "@adonisjs/lucid/orm";
import type { BelongsTo, HasOne } from "@adonisjs/lucid/types/relations";

import { SubscriptionSchema } from "#database/schema";
import Company from "#models/company";
import User from "#models/user";

export default class Subscription extends SubscriptionSchema {
	@belongsTo(() => User, { foreignKey: "createdBy" })
	declare creator: BelongsTo<typeof User>;

	@hasOne(() => Company)
	declare company: HasOne<typeof Company>;
}
