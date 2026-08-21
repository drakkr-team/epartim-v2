import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import CreateAdminPolicy from "#features/admin/admins/policies/create.policy";
import DeleteAdminPolicy from "#features/admin/admins/policies/delete.policy";
import ListAdminsPolicy from "#features/admin/admins/policies/list.policy";
import UpdateAdminPolicy from "#features/admin/admins/policies/update.policy";
import ListAdminsService from "#features/admin/admins/services/list.service";
import AdminPresenter from "#presenters/admin.presenter";
import PaginationPresenter from "#presenters/pagination.presenter";
import { PaginationValidator } from "#validators/pagination.validator";

@inject()
export default class ListAdminsController {
	constructor(
		protected listAdminsService: ListAdminsService,
		protected adminPresenter: AdminPresenter,
		protected paginationPresenter: PaginationPresenter,
	) {}

	async handle({ request, bouncer }: HttpContext) {
		await bouncer.with(ListAdminsPolicy).authorize("handle");

		const {
			page = 1,
			perPage = 20,
			q,
			orderBy,
		} = await request.validateUsing(ListAdminsController.querySchema);

		const admins = await this.listAdminsService.handle({ q, orderBy }).paginate(page, perPage);

		return {
			meta: {
				...this.paginationPresenter.toJSON(admins),
				canCreate: await bouncer.with(CreateAdminPolicy).allows("handle"),
			},
			data: await Promise.all(
				admins.all().map(async (admin) => ({
					...this.adminPresenter.toJSON(admin),
					meta: {
						canUpdate: await bouncer.with(UpdateAdminPolicy).allows("handle"),
						canDelete: await bouncer.with(DeleteAdminPolicy).allows("handle", admin.id),
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
