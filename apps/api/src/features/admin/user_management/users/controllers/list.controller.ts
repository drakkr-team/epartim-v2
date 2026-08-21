import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import ListUsersPolicy from "#features/admin/user_management/users/policies/list.policy";
import User from "#models/user";
import PaginationPresenter from "#presenters/pagination.presenter";
import UserPresenter from "#presenters/user.presenter";
import { ListUsersSchema, UserSortOptions } from "#validators/user.validator";

type SortOption = (typeof UserSortOptions)[number];
type SortDirection = "asc" | "desc";
type SortColumn = "id" | "firstName" | "lastName" | "email" | "createdAt" | "updatedAt";

const sortOptions: Record<SortOption, { column: SortColumn; direction: SortDirection }> = {
	id_asc: { column: "id", direction: "asc" },
	id_desc: { column: "id", direction: "desc" },
	firstName_asc: { column: "firstName", direction: "asc" },
	firstName_desc: { column: "firstName", direction: "desc" },
	lastName_asc: { column: "lastName", direction: "asc" },
	lastName_desc: { column: "lastName", direction: "desc" },
	email_asc: { column: "email", direction: "asc" },
	email_desc: { column: "email", direction: "desc" },
	createdAt_asc: { column: "createdAt", direction: "asc" },
	createdAt_desc: { column: "createdAt", direction: "desc" },
	updatedAt_asc: { column: "updatedAt", direction: "asc" },
	updatedAt_desc: { column: "updatedAt", direction: "desc" },
};

@inject()
export default class ListUsersController {
	constructor(
		protected userPresenter: UserPresenter,
		protected paginationPresenter: PaginationPresenter,
	) {}

	async handle({ request, bouncer }: HttpContext) {
		await bouncer.with(ListUsersPolicy).authorize("handle");

		const {
			page = 1,
			perPage = 20,
			search,
			sortBy = "createdAt_desc",
		} = await request.validateUsing(ListUsersController.querySchema);
		const { column, direction } = sortOptions[sortBy];
		const query = User.query();

		if (search) {
			query.where((searchQuery) => {
				searchQuery
					.whereILike("firstName", `%${search}%`)
					.orWhereILike("lastName", `%${search}%`)
					.orWhereILike("email", `%${search}%`);
			});
		}

		query.orderBy(column, direction).orderBy("id", direction);

		const pagination = await query.paginate(page, perPage);

		return {
			meta: this.paginationPresenter.toJSON(pagination),
			data: pagination.all().map((user) => this.userPresenter.toJSON(user)),
		};
	}

	static querySchema = vine.create(ListUsersSchema);
}
