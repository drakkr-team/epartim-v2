import { inject } from "@adonisjs/core";
import db from "@adonisjs/lucid/services/db";
import type { Infer } from "@vinejs/vine/types";

import type { SubscriptionFormalismGroup } from "#constants/subscription_formalism";
import SubscriptionFormalismService from "#features/client/subscriptions/services/update/formalism/formalism.service";
import type Subscription from "#models/subscription";
import SubscriptionCseMember from "#models/subscription_cse_member";
import { presentCseMember } from "#presenters/subscription_formalism.presenter";
import type { UpdateFormalismMemberSchema } from "#validators/subscription/formalism.validator";

@inject()
export default class SubscriptionFormalismMembersService {
	constructor(protected formalismService: SubscriptionFormalismService) {}
	async create(subscription: Subscription, group: SubscriptionFormalismGroup) {
		return db.transaction(async (trx) => {
			await this.formalismService.lock(subscription, trx);
			const record = await this.formalismService.requireCse(subscription, group, trx);
			const member = await SubscriptionCseMember.create(
				{ subscriptionFormalismId: record.id },
				{ client: trx },
			);
			await this.formalismService.invalidate(subscription, trx);
			return presentCseMember(member);
		});
	}
	async update(
		subscription: Subscription,
		group: SubscriptionFormalismGroup,
		memberId: number,
		payload: Infer<typeof UpdateFormalismMemberSchema>,
	) {
		return db.transaction(async (trx) => {
			await this.formalismService.lock(subscription, trx);
			const record = await this.formalismService.requireCse(subscription, group, trx);
			const member = await SubscriptionCseMember.query({ client: trx })
				.where("subscriptionFormalismId", record.id)
				.where("id", memberId)
				.firstOrFail();
			await member.useTransaction(trx).merge(payload).save();
			await this.formalismService.invalidate(subscription, trx);
			return presentCseMember(member);
		});
	}
	async delete(subscription: Subscription, group: SubscriptionFormalismGroup, memberId: number) {
		await db.transaction(async (trx) => {
			await this.formalismService.lock(subscription, trx);
			const record = await this.formalismService.requireCse(subscription, group, trx);
			const member = await SubscriptionCseMember.query({ client: trx })
				.where("subscriptionFormalismId", record.id)
				.where("id", memberId)
				.firstOrFail();
			await member.useTransaction(trx).delete();
			await this.formalismService.invalidate(subscription, trx);
		});
	}
}
