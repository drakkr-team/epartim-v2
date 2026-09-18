import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";

import DeleteRolePolicy from "#features/admin/roles/policies/delete.policy";
import DeleteRoleService from "#features/admin/roles/services/delete.service";
import Role from "#models/role";

@inject()
export default class DeleteRoleController {
	constructor(protected deleteRoleService: DeleteRoleService) {}

	async handle({ params, response, bouncer }: HttpContext) {
		const { roleId } = params;
		const role = await Role.findOrFail(roleId);

		await bouncer.with(DeleteRolePolicy).authorize("handle", role);

		await this.deleteRoleService.handle(role);

		return response.noContent();
	}
}
