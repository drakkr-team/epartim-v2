import { belongsTo } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";

import { SubscriptionFormalismEmployeeSchema } from "#database/schema";
import Subscription from "#models/subscription";

export default class SubscriptionFormalismEmployee extends SubscriptionFormalismEmployeeSchema {
	@belongsTo(() => Subscription)
	declare subscription: BelongsTo<typeof Subscription>;
}
