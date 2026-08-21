import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import ListAdminsPolicy from "#features/admin/admin_management/admins/policies/list.policy";
import Admin from "#models/admin";
import AdminPresenter from "#presenters/admin.presenter";
import PaginationPresenter from "#presenters/pagination.presenter";
import { AdminSortOptions, ListAdminsSchema } from "#validators/admin.validator";

type SortOption = (typeof AdminSortOptions)[number];
type SortDirection = "asc" | "desc";
type SortColumn = "id" | "name" | "email" | "activatedAt" | "createdAt" | "updatedAt";

const sortOptions: Record<SortOption, { column: SortColumn; direction: SortDirection }> = {
	id_asc: { column: "id", direction: "asc" },
	id_desc: { column: "id", direction: "desc" },
	name_asc: { column: "name", direction: "asc" },
	name_desc: { column: "name", direction: "desc" },
	email_asc: { column: "email", direction: "asc" },
	email_desc: { column: "email", direction: "desc" },
	activatedAt_asc: { column: "activatedAt", direction: "asc" },
	activatedAt_desc: { column: "activatedAt", direction: "desc" },
	createdAt_asc: { column: "createdAt", direction: "asc" },
	createdAt_desc: { column: "createdAt", direction: "desc" },
	updatedAt_asc: { column: "updatedAt", direction: "asc" },
	updatedAt_desc: { column: "updatedAt", direction: "desc" },
};

@inject()
export default class ListAdminsController {
	constructor(
		protected adminPresenter: AdminPresenter,
		protected paginationPresenter: PaginationPresenter,
	) {}

	async handle({ request, bouncer }: HttpContext) {
		await bouncer.with(ListAdminsPolicy).authorize("handle");

		const {
			page = 1,
			perPage = 20,
			search,
			sortBy = "createdAt_desc",
		} = await request.validateUsing(ListAdminsController.querySchema);
		const { column, direction } = sortOptions[sortBy];
		const query = Admin.query();

		if (search) {
			query.where((searchQuery) => {
				searchQuery.whereILike("name", `%${search}%`).orWhereILike("email", `%${search}%`);
			});
		}

		if (column === "activatedAt") {
			query.orderByRaw(`activated_at ${direction} NULLS LAST`);
		} else {
			query.orderBy(column, direction);
		}

		query.orderBy("id", direction);

		const pagination = await query.paginate(page, perPage);

		return {
			meta: this.paginationPresenter.toJSON(pagination),
			data: pagination.all().map((admin) => this.adminPresenter.toJSON(admin)),
		};
	}

	static querySchema = vine.create(ListAdminsSchema);
}
