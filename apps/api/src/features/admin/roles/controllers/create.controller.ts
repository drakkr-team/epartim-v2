import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import CreateRolePolicy from "#features/admin/roles/policies/create.policy";
import Role from "#models/role";
import RolePresenter from "#presenters/role.presenter";
import { CreateRoleSchema } from "#validators/role.validator";

@inject()
export default class CreateRoleController {
	constructor(protected rolePresenter: RolePresenter) {}

	async handle({ request, response, bouncer }: HttpContext) {
		await bouncer.with(CreateRolePolicy).authorize("handle");

		const payload = await request.validateUsing(CreateRoleController.payloadSchema);
		const role = await Role.create({
			...payload,
			isSuperAdmin: false,
		});

		return response.created(this.rolePresenter.toJSON(role));
	}

	static payloadSchema = vine.create(CreateRoleSchema);
}
