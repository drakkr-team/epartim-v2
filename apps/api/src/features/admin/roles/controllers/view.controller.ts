import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";

import DeleteRolePolicy from "#features/admin/roles/policies/delete.policy";
import UpdateRolePolicy from "#features/admin/roles/policies/update.policy";
import ViewRolePolicy from "#features/admin/roles/policies/view.policy";
import Role from "#models/role";
import RolePresenter from "#presenters/role.presenter";

@inject()
export default class ViewRoleController {
	constructor(protected rolePresenter: RolePresenter) {}

	async handle({ params, bouncer }: HttpContext) {
		const { roleId } = params;

		await bouncer.with(ViewRolePolicy).authorize("handle");

		const role = await Role.findOrFail(roleId);

		return {
			...this.rolePresenter.toJSON(role),
			meta: {
				canUpdate: await bouncer.with(UpdateRolePolicy).allows("handle"),
				canDelete: await bouncer.with(DeleteRolePolicy).allows("handle"),
			},
		};
	}
}
