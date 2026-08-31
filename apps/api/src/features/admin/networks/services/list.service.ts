import type { ModelQueryBuilderContract } from "@adonisjs/lucid/types/model";

import Network from "#models/network";
import type { NetworkOrderBy } from "#validators/network.validator";

export type { NetworkOrderBy } from "#validators/network.validator";

const orderColumns = {
	id: "id",
	name: "name",
	amundiOrgId: "amundi_org_id",
	goCode: "go_code",
	createdAt: "created_at",
	updatedAt: "updated_at",
} as const;

export default class ListNetworksService {
	handle(params: { q?: string; orderBy?: NetworkOrderBy }) {
		const query = Network.query().preload("address").preload("paymentDetails");

		if (params.q) {
			this.#searchQuery(query, params.q);
		}

		if (params.orderBy) {
			this.#orderByQuery(query, params.orderBy);
		} else {
			query.orderBy("created_at", "desc").orderBy("id", "desc");
		}

		return query;
	}

	#searchQuery(query: ModelQueryBuilderContract<typeof Network>, search: string) {
		return query.whereILike("networks.name", `%${search}%`);
	}

	#orderByQuery(query: ModelQueryBuilderContract<typeof Network>, orderBy: NetworkOrderBy) {
		const separatorIndex = orderBy.lastIndexOf("_");
		const field = orderBy.slice(0, separatorIndex) as keyof typeof orderColumns;
		const direction = orderBy.slice(separatorIndex + 1) as "asc" | "desc";

		return query.orderBy(orderColumns[field], direction);
	}
}
