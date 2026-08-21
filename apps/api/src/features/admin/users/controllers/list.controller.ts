import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import CreateUserPolicy from "#features/admin/users/policies/create.policy";
import DeleteUserPolicy from "#features/admin/users/policies/delete.policy";
import ListUsersPolicy from "#features/admin/users/policies/list.policy";
import UpdateUserPolicy from "#features/admin/users/policies/update.policy";
import ListUsersService from "#features/admin/users/services/list.service";
import PaginationPresenter from "#presenters/pagination.presenter";
import UserPresenter from "#presenters/user.presenter";
import { PaginationValidator } from "#validators/pagination.validator";

@inject()
export default class ListUsersController {
	constructor(
		protected listUsersService: ListUsersService,
		protected userPresenter: UserPresenter,
		protected paginationPresenter: PaginationPresenter,
	) {}

	async handle({ request, bouncer }: HttpContext) {
		await bouncer.with(ListUsersPolicy).authorize("handle");

		const {
			page = 1,
			perPage = 20,
			q,
			orderBy,
		} = await request.validateUsing(ListUsersController.querySchema);
		const users = await this.listUsersService.handle({ q, orderBy }).paginate(page, perPage);

		return {
			meta: {
				...this.paginationPresenter.toJSON(users),
				canCreate: await bouncer.with(CreateUserPolicy).allows("handle"),
			},
			data: await Promise.all(
				users.all().map(async (user) => ({
					...this.userPresenter.toJSON(user),
					meta: {
						canUpdate: await bouncer.with(UpdateUserPolicy).allows("handle"),
						canDelete: await bouncer.with(DeleteUserPolicy).allows("handle", user.id),
					},
				})),
			),
		};
	}

	static querySchema = vine.create({
		...PaginationValidator.getProperties(),
		q: vine.string().optional(),
		orderBy: vine.string().optional(),
	});
}
