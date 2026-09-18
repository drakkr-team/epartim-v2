import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";

import DeleteAdminPolicy from "#features/admin/admins/policies/delete.policy";
import UpdateAdminPolicy from "#features/admin/admins/policies/update.policy";
import ViewAdminPolicy from "#features/admin/admins/policies/view.policy";
import Admin from "#models/admin";
import AdminPresenter from "#presenters/admin.presenter";
import RolePresenter from "#presenters/role.presenter";

@inject()
export default class ViewAdminController {
	constructor(
		protected adminPresenter: AdminPresenter,
		protected rolePresenter: RolePresenter,
	) {}

	async handle({ params, bouncer }: HttpContext) {
		const { adminId } = params;

		await bouncer.with(ViewAdminPolicy).authorize("handle");

		const admin = await Admin.findOrFail(adminId);
		await admin.load("role");

		return {
			...this.adminPresenter.toJSON(admin),
			role: this.rolePresenter.toJSON(admin.role),
			meta: {
				canUpdate: await bouncer.with(UpdateAdminPolicy).allows("handle"),
				canDelete: await bouncer.with(DeleteAdminPolicy).allows("handle", admin.id),
			},
		};
	}
}
