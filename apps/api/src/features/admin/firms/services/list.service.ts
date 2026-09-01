import type { ModelQueryBuilderContract } from "@adonisjs/lucid/types/model";

import Firm from "#models/firm";

export default class ListFirmsService {
	handle(params: { q?: string; orderBy?: string; networkId?: number }) {
		const { q, orderBy, networkId } = params;

		return Firm.query()
			.if(q, (query) => this.#searchQuery(query, q!))
			.if(networkId, (query) => query.where("firms.network_id", networkId!))
			.if(orderBy, (query) => this.#orderByQuery(query, orderBy!))
			.orderBy("created_at", "desc");
	}

	#orderByQuery(query: ModelQueryBuilderContract<typeof Firm>, orderBy: string) {
		const options = [
			{ id: "id_asc", value: { column: "id", order: "asc" } },
			{ id: "id_desc", value: { column: "id", order: "desc" } },
			{ id: "name_asc", value: { column: "name", order: "asc" } },
			{ id: "name_desc", value: { column: "name", order: "desc" } },
			{ id: "amundiOrgId_asc", value: { column: "amundi_org_id", order: "asc" } },
			{ id: "amundiOrgId_desc", value: { column: "amundi_org_id", order: "desc" } },
			{ id: "orias_asc", value: { column: "orias", order: "asc" } },
			{ id: "orias_desc", value: { column: "orias", order: "desc" } },
			{ id: "networkId_asc", value: { column: "network_id", order: "asc" } },
			{ id: "networkId_desc", value: { column: "network_id", order: "desc" } },
			{ id: "createdAt_asc", value: { column: "created_at", order: "asc" } },
			{ id: "createdAt_desc", value: { column: "created_at", order: "desc" } },
			{ id: "updatedAt_asc", value: { column: "updated_at", order: "asc" } },
			{ id: "updatedAt_desc", value: { column: "updated_at", order: "desc" } },
		] as const;

		const option = options.find((option) => option.id === orderBy);

		return query.if(option, (query) => query.orderBy(option!.value.column, option!.value.order));
	}

	#searchQuery(query: ModelQueryBuilderContract<typeof Firm>, search: string) {
		return query.whereILike("firms.name", `%${search}%`);
	}
}
