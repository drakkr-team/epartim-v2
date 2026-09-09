import type { ModelQueryBuilderContract } from "@adonisjs/lucid/types/model";
import { DateTime } from "luxon";

import Subscription, { SubscriptionStatus } from "#models/subscription";

export const subscriptionListStatuses = ["draft", "validating", "finalized"] as const;

export type SubscriptionListStatus = (typeof subscriptionListStatuses)[number];

const tabsListStatus: Record<SubscriptionListStatus, readonly number[]> = {
	draft: [SubscriptionStatus.DRAFT],
	validating: [SubscriptionStatus.WAITING_FOR_SIGNATURES, SubscriptionStatus.TO_BE_SENT],
	finalized: [SubscriptionStatus.COMPLETE, SubscriptionStatus.ERROR],
};

type ListSubscriptionsParams = {
	createdAtFrom?: Date;
	createdAtTo?: Date;
	progress?: number;
	q?: string;
	status?: SubscriptionListStatus;
};

type SubscriptionStatusCounts = Record<SubscriptionListStatus, number>;

export default class ListSubscriptionsService {
	handle(params: ListSubscriptionsParams = {}) {
		return this.#buildQuery(params).orderBy("created_at", "desc").orderBy("id", "desc");
	}

	async getStatusCounts(
		params: Pick<ListSubscriptionsParams, "q" | "progress" | "createdAtFrom" | "createdAtTo">,
	): Promise<SubscriptionStatusCounts> {
		const subscriptions = await this.#buildQuery(params)
			.select("status")
			.count("* as total")
			.groupBy("status");
		const counts: SubscriptionStatusCounts = { draft: 0, validating: 0, finalized: 0 };

		for (const subscription of subscriptions) {
			const status = subscriptionListStatuses.find((listStatus) =>
				tabsListStatus[listStatus].includes(subscription.status),
			);

			if (!status) {
				throw new Error(`Unsupported subscription status: ${subscription.status}`);
			}

			counts[status] += Number(subscription.$extras.total);
		}

		return counts;
	}

	#buildQuery(params: ListSubscriptionsParams) {
		const { createdAtFrom, createdAtTo, progress, q, status } = params;

		return Subscription.query()
			.if(q, (query) => this.#searchQuery(query, q!))
			.if(progress !== undefined, (query) => this.#progressQuery(query, progress!))
			.if(createdAtFrom && !createdAtTo, (query) =>
				this.#dateRangeQuery(query, createdAtFrom!, createdAtFrom!),
			)
			.if(createdAtFrom && createdAtTo, (query) =>
				this.#dateRangeQuery(query, createdAtFrom!, createdAtTo!),
			)
			.if(createdAtTo && !createdAtFrom, (query) =>
				query.where("subscriptions.created_at", "<", this.#rangeEnd(createdAtTo!)),
			)
			.if(status, (query) =>
				query.whereIn("subscriptions.status", Array.from(tabsListStatus[status!])),
			);
	}

	#progressQuery(query: ModelQueryBuilderContract<typeof Subscription>, progress: number) {
		return query.whereRaw(
			"least(greatest(coalesce(jsonb_array_length(subscriptions.completed_steps), 0) + 1, 1), 5) = ?",
			[progress],
		);
	}

	#dateRangeQuery(query: ModelQueryBuilderContract<typeof Subscription>, from: Date, to: Date) {
		return query
			.where("subscriptions.created_at", ">=", from)
			.where("subscriptions.created_at", "<", this.#rangeEnd(to));
	}

	#rangeEnd(date: Date) {
		return DateTime.fromJSDate(date).plus({ days: 1 }).toJSDate();
	}

	#searchQuery(query: ModelQueryBuilderContract<typeof Subscription>, q: string) {
		return query.where((query) =>
			query
				.whereHas("company", (companyQuery) => companyQuery.whereILike("name", `%${q}%`))
				.orWhereRaw(
					"concat('BSE-', to_char(subscriptions.created_at, 'YYYY'), '-', lpad(subscriptions.id::text, greatest(length(subscriptions.id::text), 4), '0')) ILIKE ?",
					[`%${q}%`],
				),
		);
	}
}
