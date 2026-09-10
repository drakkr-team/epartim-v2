import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import UpdateRolePolicy from "#features/admin/roles/policies/update.policy";
import Role from "#models/role";
import RolePresenter from "#presenters/role.presenter";
import { UpdateRoleSchema } from "#validators/role.validator";

@inject()
export default class UpdateRoleController {
	constructor(protected rolePresenter: RolePresenter) {}

	async handle({ params, request, bouncer }: HttpContext) {
		const { roleId } = params;

		await bouncer.with(UpdateRolePolicy).authorize("handle");

		const payload = await request.validateUsing(UpdateRoleController.payloadSchema);
		const role = await Role.findOrFail(roleId);
		await role.merge(payload).save();

		return this.rolePresenter.toJSON(role);
	}

	static payloadSchema = vine.create(UpdateRoleSchema);
}
