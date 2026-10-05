import { belongsTo } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";

import type { SubscriptionCseFunction } from "#constants/subscription_formalism";
import { SubscriptionCseMemberSchema } from "#database/schema";
import SubscriptionFormalism from "#models/subscription_formalism";

export default class SubscriptionCseMember extends SubscriptionCseMemberSchema {
	declare function: SubscriptionCseFunction | null;
	@belongsTo(() => SubscriptionFormalism)
	declare subscriptionFormalism: BelongsTo<typeof SubscriptionFormalism>;
}
