import { belongsTo, hasMany } from "@adonisjs/lucid/orm";
import type { BelongsTo, HasMany } from "@adonisjs/lucid/types/relations";

import type {
	SubscriptionFormalismGroup,
	SubscriptionFormalismMethod,
} from "#constants/subscription_formalism";
import { SubscriptionFormalismSchema } from "#database/schema";
import Subscription from "#models/subscription";
import SubscriptionCseMember from "#models/subscription_cse_member";

export default class SubscriptionFormalism extends SubscriptionFormalismSchema {
	declare group: SubscriptionFormalismGroup;
	declare method: SubscriptionFormalismMethod | null;
	@belongsTo(() => Subscription)
	declare subscription: BelongsTo<typeof Subscription>;
	@hasMany(() => SubscriptionCseMember)
	declare members: HasMany<typeof SubscriptionCseMember>;
}
