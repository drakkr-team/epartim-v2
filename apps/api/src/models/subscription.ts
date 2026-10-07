import { belongsTo, column, hasMany, hasOne, scope } from "@adonisjs/lucid/orm";
import type { BelongsTo, HasMany, HasOne } from "@adonisjs/lucid/types/relations";

import { USER_ROLES } from "#constants/user";
import { SubscriptionSchema } from "#database/schema";
import Company from "#models/company";
import Firm from "#models/firm";
import SubscriptionContractFee from "#models/subscription_contract_fee";
import SubscriptionDocument from "#models/subscription_document";
import SubscriptionExistingAgreement from "#models/subscription_existing_agreement";
import SubscriptionPlan from "#models/subscription_plan";
import User from "#models/user";
import { jsonColumn } from "#src/utils/json_column";

export const SubscriptionStatus = {
	DRAFT: 0,
	WAITING_FOR_SIGNATURES: 1,
	TO_BE_SENT: 2,
	COMPLETE: 3,
	ERROR: 4,
	WAITING_FOR_EPARTIM_VALIDATION: 5,
} as const;

export type SubscriptionStatus = (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];

export default class Subscription extends SubscriptionSchema {
	static accessibleTo = scope((query, user: User) => {
		if (user.role === USER_ROLES.ADMIN) return;
		if (!Object.values(USER_ROLES).includes(user.role)) {
			query.whereIn("subscriptions.id", []);
			return;
		}

		query.where((access) => {
			access.where("subscriptions.created_by", user.id);
			const firmId = user.firmId;
			if (firmId == null) return;

			if (user.role === USER_ROLES.FIRM) {
				access.orWhereIn(
					"subscriptions.created_by",
					User.query().select("id").where("firm_id", firmId),
				);
			}
			if (user.role === USER_ROLES.NETWORK) {
				access.orWhereIn(
					"subscriptions.created_by",
					User.query()
						.select("id")
						.whereHas("firm", (firm) =>
							firm.whereIn(
								"network_id",
								Firm.query().select("network_id").where("id", firmId).whereNotNull("network_id"),
							),
						),
				);
			}
		});
	});

	@column(jsonColumn<unknown[]>())
	declare completedSteps: unknown[] | null;

	@belongsTo(() => User, { foreignKey: "createdBy" })
	declare creator: BelongsTo<typeof User>;

	@hasOne(() => Company)
	declare company: HasOne<typeof Company>;

	@hasMany(() => SubscriptionDocument)
	declare documents: HasMany<typeof SubscriptionDocument>;

	@hasMany(() => SubscriptionExistingAgreement)
	declare existingAgreements: HasMany<typeof SubscriptionExistingAgreement>;

	@hasOne(() => SubscriptionPlan)
	declare plan: HasOne<typeof SubscriptionPlan>;

	@hasOne(() => SubscriptionContractFee)
	declare contractFees: HasOne<typeof SubscriptionContractFee>;

	get isDraft() {
		return this.status === SubscriptionStatus.DRAFT;
	}

	get isWaitingForEpartimValidation() {
		return this.status === SubscriptionStatus.WAITING_FOR_EPARTIM_VALIDATION;
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
