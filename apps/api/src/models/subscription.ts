import { belongsTo, column, hasOne } from "@adonisjs/lucid/orm";
import type { BelongsTo, HasOne } from "@adonisjs/lucid/types/relations";

import { SubscriptionSchema } from "#database/schema";
import Company from "#models/company";
import User from "#models/user";

export const SubscriptionStatus = {
	DRAFT: 0,
	WAITING_FOR_SIGNATURES: 1,
	TO_BE_SENT: 2,
	COMPLETE: 3,
	ERROR: 4,
} as const;

export type SubscriptionStatus = (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];

export default class Subscription extends SubscriptionSchema {
	@column({
		prepare: (completedSteps: unknown[] | null) =>
			completedSteps === null ? null : JSON.stringify(completedSteps),
		consume: (completedSteps: unknown[] | null) => completedSteps,
	})
	declare completedSteps: unknown[] | null;

	@belongsTo(() => User, { foreignKey: "createdBy" })
	declare creator: BelongsTo<typeof User>;

	@hasOne(() => Company)
	declare company: HasOne<typeof Company>;

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
