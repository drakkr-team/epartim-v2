import type { SimplePaginatorContract } from "@adonisjs/lucid/types/querybuilder";

export default class PaginationPresenter {
	toJSON(pagination: SimplePaginatorContract<unknown>) {
		return {
			perPage: pagination.perPage,
			currentPage: pagination.currentPage,
			total: pagination.total,
			firstPage: pagination.firstPage,
			lastPage: pagination.lastPage,
			isEmpty: pagination.isEmpty,
			hasPages: pagination.hasPages,
			hasMorePages: pagination.hasMorePages,
		};
	}
}
