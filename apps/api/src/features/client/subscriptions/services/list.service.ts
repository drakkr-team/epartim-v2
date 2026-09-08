import type { ModelQueryBuilderContract } from "@adonisjs/lucid/types/model";

import Subscription, { SubscriptionStatus } from "#models/subscription";

export const subscriptionListStatuses = ["draft", "validating", "finalized"] as const;

export type SubscriptionListStatus = (typeof subscriptionListStatuses)[number];

const tabsListStatus: Record<SubscriptionListStatus, readonly number[]> = {
	draft: [SubscriptionStatus.DRAFT],
	validating: [SubscriptionStatus.WAITING_FOR_SIGNATURES, SubscriptionStatus.TO_BE_SENT],
	finalized: [SubscriptionStatus.COMPLETE, SubscriptionStatus.ERROR],
};

type ListSubscriptionsParams = {
	q?: string;
	status?: SubscriptionListStatus;
};

type SubscriptionStatusCounts = Record<SubscriptionListStatus, number>;

export default class ListSubscriptionsService {
	handle(params: ListSubscriptionsParams = {}) {
		return this.#buildQuery(params)
			.preload("company")
			.orderBy("created_at", "desc")
			.orderBy("id", "desc");
	}

	async getStatusCounts(
		params: Pick<ListSubscriptionsParams, "q">,
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
		const { q, status } = params;

		return Subscription.query()
			.if(q, (query) => this.#searchQuery(query, q!))
			.if(status, (query) =>
				query.whereIn("subscriptions.status", Array.from(tabsListStatus[status!])),
			);
	}

	#searchQuery(query: ModelQueryBuilderContract<typeof Subscription>, q: string) {
		return query.where((query) =>
			query
				.whereHas("company", (companyQuery) => companyQuery.whereILike("name", `%${q}%`))
				.orWhereRaw(
					"concat('BSE-', to_char(subscriptions.created_at, 'YYYY'), '-', lpad(subscriptions.id::text, 4, '0')) ILIKE ?",
					[`%${q}%`],
				),
		);
	}
}
