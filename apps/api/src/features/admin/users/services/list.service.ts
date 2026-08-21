import type { ModelQueryBuilderContract } from "@adonisjs/lucid/types/model";

import User from "#models/user";

export default class ListUsersService {
	handle(params: { q?: string; orderBy?: string }) {
		const { q, orderBy } = params;

		return User.query()
			.if(q, (query) => this.#searchQuery(query, q!))
			.if(orderBy, (query) => this.#orderByQuery(query, orderBy!))
			.orderBy("created_at", "desc");
	}

	#orderByQuery(query: ModelQueryBuilderContract<typeof User>, orderBy?: string) {
		const options = [
			{ id: "id_asc", value: { column: "id", order: "asc" } },
			{ id: "id_desc", value: { column: "id", order: "desc" } },
			{ id: "firstName_asc", value: { column: "first_name", order: "asc" } },
			{ id: "firstName_desc", value: { column: "first_name", order: "desc" } },
			{ id: "lastName_asc", value: { column: "last_name", order: "asc" } },
			{ id: "lastName_desc", value: { column: "last_name", order: "desc" } },
			{ id: "email_asc", value: { column: "email", order: "asc" } },
			{ id: "email_desc", value: { column: "email", order: "desc" } },
			{ id: "createdAt_asc", value: { column: "created_at", order: "asc" } },
			{ id: "createdAt_desc", value: { column: "created_at", order: "desc" } },
			{ id: "updatedAt_asc", value: { column: "updated_at", order: "asc" } },
			{ id: "updatedAt_desc", value: { column: "updated_at", order: "desc" } },
		] as const;
		const option = options.find((option) => option.id === orderBy);

		return query.if(option, (query) =>
			query.orderBy(option!.value.column, option!.value.order).orderBy("id", option!.value.order),
		);
	}

	#searchQuery(query: ModelQueryBuilderContract<typeof User>, q: string) {
		const searchableFields = ["users.first_name", "users.last_name", "users.email"];
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
