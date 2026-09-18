import type { ModelQueryBuilderContract } from "@adonisjs/lucid/types/model";

import Role from "#models/role";

export default class ListRolesService {
	handle(params: { currentUserRole: Role; q?: string; orderBy?: string }) {
		const { currentUserRole, q, orderBy } = params;

		const currentUserIsSuperAdmin = currentUserRole.isSuperAdmin;

		return Role.query()
			.if(!currentUserIsSuperAdmin, (query) => query.where("is_super_admin", false))
			.if(q, (query) => this.#searchQuery(query, q!))
			.if(orderBy, (query) => this.#orderByQuery(query, orderBy!))
			.orderBy("created_at", "desc");
	}

	#orderByQuery(query: ModelQueryBuilderContract<typeof Role>, orderBy: string) {
		const options = [
			{ id: "id_asc", value: { column: "id", order: "asc" } },
			{ id: "id_desc", value: { column: "id", order: "desc" } },
			{ id: "name_asc", value: { column: "name", order: "asc" } },
			{ id: "name_desc", value: { column: "name", order: "desc" } },
			{ id: "createdAt_asc", value: { column: "created_at", order: "asc" } },
			{ id: "createdAt_desc", value: { column: "created_at", order: "desc" } },
			{ id: "updatedAt_asc", value: { column: "updated_at", order: "asc" } },
			{ id: "updatedAt_desc", value: { column: "updated_at", order: "desc" } },
		] as const;

		const option = options.find((option) => option.id === orderBy);

		return query.if(option, (query) => query.orderBy(option!.value.column, option!.value.order));
	}

	#searchQuery(query: ModelQueryBuilderContract<typeof Role>, search: string) {
		return query.whereILike("roles.name", `%${search}%`);
	}
}
