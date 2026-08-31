import type { ModelQueryBuilderContract } from "@adonisjs/lucid/types/model";

import Firm from "#models/firm";

export const FirmOrderByValues = [
	"id_asc",
	"id_desc",
	"name_asc",
	"name_desc",
	"amundiOrgId_asc",
	"amundiOrgId_desc",
	"orias_asc",
	"orias_desc",
	"networkId_asc",
	"networkId_desc",
	"createdAt_asc",
	"createdAt_desc",
	"updatedAt_asc",
	"updatedAt_desc",
] as const;

const FirmOrderBy = {
	id_asc: { column: "id", direction: "asc" },
	id_desc: { column: "id", direction: "desc" },
	name_asc: { column: "name", direction: "asc" },
	name_desc: { column: "name", direction: "desc" },
	amundiOrgId_asc: { column: "amundi_org_id", direction: "asc" },
	amundiOrgId_desc: { column: "amundi_org_id", direction: "desc" },
	orias_asc: { column: "orias", direction: "asc" },
	orias_desc: { column: "orias", direction: "desc" },
	networkId_asc: { column: "network_id", direction: "asc" },
	networkId_desc: { column: "network_id", direction: "desc" },
	createdAt_asc: { column: "created_at", direction: "asc" },
	createdAt_desc: { column: "created_at", direction: "desc" },
	updatedAt_asc: { column: "updated_at", direction: "asc" },
	updatedAt_desc: { column: "updated_at", direction: "desc" },
} as const;

export type FirmOrderByValue = (typeof FirmOrderByValues)[number];

export default class ListFirmsService {
	handle(params: { q?: string; networkId?: number; orderBy?: FirmOrderByValue }) {
		const query = Firm.query().preload("address").preload("paymentDetails");

		if (params.q) {
			this.#searchQuery(query, params.q);
		}

		if (params.networkId !== undefined) {
			query.where("firms.network_id", params.networkId);
		}

		if (params.orderBy) {
			const orderBy = FirmOrderBy[params.orderBy];
			query.orderBy(orderBy.column, orderBy.direction);
		} else {
			query.orderBy("created_at", "desc").orderBy("id", "desc");
		}

		return query;
	}

	#searchQuery(query: ModelQueryBuilderContract<typeof Firm>, search: string) {
		return query.whereILike("firms.name", `%${search}%`);
	}
}
