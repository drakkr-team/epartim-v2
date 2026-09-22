import { belongsTo, column, hasMany, hasOne } from "@adonisjs/lucid/orm";
import type { BelongsTo, HasMany, HasOne } from "@adonisjs/lucid/types/relations";

import { SubscriptionSchema } from "#database/schema";
import Company from "#models/company";
import SubscriptionDocument from "#models/subscription_document";
import User from "#models/user";
import { jsonColumn } from "#src/utils/json_column";

export const SubscriptionStatus = {
	DRAFT: 0,
	WAITING_FOR_SIGNATURES: 1,
	TO_BE_SENT: 2,
	COMPLETE: 3,
	ERROR: 4,
} as const;

export type SubscriptionStatus = (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];

export default class Subscription extends SubscriptionSchema {
	@column(jsonColumn<unknown[]>())
	declare completedSteps: unknown[] | null;

	@belongsTo(() => User, { foreignKey: "createdBy" })
	declare creator: BelongsTo<typeof User>;

	@hasOne(() => Company)
	declare company: HasOne<typeof Company>;

	@hasMany(() => SubscriptionDocument)
	declare documents: HasMany<typeof SubscriptionDocument>;

	get isDraft() {
		return this.status === SubscriptionStatus.DRAFT;
	}

	get isWaitingForSignatures() {
		return this.status === SubscriptionStatus.WAITING_FOR_SIGNATURES;
	}

	get isToBeSent() {
		return this.status === SubscriptionStatus.TO_BE_SENT;
	}

	get isComplete() {
		return this.status === SubscriptionStatus.COMPLETE;
	}

	get isError() {
		return this.status === SubscriptionStatus.ERROR;
	}
}
