import type { ModelQueryBuilderContract } from "@adonisjs/lucid/types/model";

import Admin from "#models/admin";

export default class ListAdminsService {
	handle(params: { q?: string; orderBy?: string }) {
		const { q, orderBy } = params;

		return Admin.query()
			.if(q, (query) => this.#searchQuery(query, q!))
			.if(orderBy, (query) => this.#orderByQuery(query, orderBy!))
			.orderBy("created_at", "desc");
	}

	#orderByQuery(query: ModelQueryBuilderContract<typeof Admin>, orderBy: string) {
		const options = [
			{ id: "id_asc", value: { column: "id", order: "asc" } },
			{ id: "id_desc", value: { column: "id", order: "desc" } },
			{ id: "name_asc", value: { column: "name", order: "asc" } },
			{ id: "name_desc", value: { column: "name", order: "desc" } },
			{ id: "email_asc", value: { column: "email", order: "asc" } },
			{ id: "email_desc", value: { column: "email", order: "desc" } },
			{ id: "activatedAt_asc", value: { column: "activated_at", order: "asc" } },
			{ id: "activatedAt_desc", value: { column: "activated_at", order: "desc" } },
			{ id: "createdAt_asc", value: { column: "created_at", order: "asc" } },
			{ id: "createdAt_desc", value: { column: "created_at", order: "desc" } },
			{ id: "updatedAt_asc", value: { column: "updated_at", order: "asc" } },
			{ id: "updatedAt_desc", value: { column: "updated_at", order: "desc" } },
		] as const;

		const option = options.find((option) => option.id === orderBy);

		return query.if(option, (query) => query.orderBy(option!.value.column, option!.value.order));
	}

	#searchQuery(query: ModelQueryBuilderContract<typeof Admin>, q: string) {
		const searchableFields = ["admins.name", "admins.email"];
		const searchWords = q.split(" ").filter(Boolean);

		return query.where((query) => {
			searchWords.forEach((word) => {
				searchableFields.forEach((field) => {
					query.orWhereILike(field, `%${word}%`);
				});
			});
		});
	}
}
