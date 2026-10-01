import { belongsTo } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";

import type { SubscriptionAgreement } from "#constants/subscription_agreement";
import { SubscriptionExistingAgreementSchema } from "#database/schema";
import Subscription from "#models/subscription";

export default class SubscriptionExistingAgreement extends SubscriptionExistingAgreementSchema {
	declare type: SubscriptionAgreement;

	@belongsTo(() => Subscription)
	declare subscription: BelongsTo<typeof Subscription>;
}
