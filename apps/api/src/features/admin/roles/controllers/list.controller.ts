import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import CreateRolePolicy from "#features/admin/roles/policies/create.policy";
import DeleteRolePolicy from "#features/admin/roles/policies/delete.policy";
import ListRolePolicy from "#features/admin/roles/policies/list.policy";
import UpdateRolePolicy from "#features/admin/roles/policies/update.policy";
import ListRolesService from "#features/admin/roles/services/list.service";
import PaginationPresenter from "#presenters/pagination.presenter";
import RolePresenter from "#presenters/role.presenter";
import { PaginationValidator } from "#validators/pagination.validator";

@inject()
export default class ListRolesController {
	constructor(
		protected listRolesService: ListRolesService,
		protected rolePresenter: RolePresenter,
		protected paginationPresenter: PaginationPresenter,
	) {}

	async handle({ request, bouncer }: HttpContext) {
		await bouncer.with(ListRolePolicy).authorize("handle");

		const {
			page = 1,
			perPage = 20,
			q,
			orderBy,
		} = await request.validateUsing(ListRolesController.querySchema);

		const roles = await this.listRolesService.handle({ q, orderBy }).paginate(page, perPage);

		return {
			meta: {
				...this.paginationPresenter.toJSON(roles),
				canCreate: await bouncer.with(CreateRolePolicy).allows("handle"),
			},
			data: await Promise.all(
				roles.all().map(async (role) => ({
					...this.rolePresenter.toJSON(role),
					meta: {
						canUpdate: await bouncer.with(UpdateRolePolicy).allows("handle"),
						canDelete: await bouncer.with(DeleteRolePolicy).allows("handle"),
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
