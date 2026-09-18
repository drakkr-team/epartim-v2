import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";

import DeleteRolePolicy from "#features/admin/roles/policies/delete.policy";
import DeleteRoleService from "#features/admin/roles/services/delete.service";

@inject()
export default class DeleteRoleController {
	constructor(protected deleteRoleService: DeleteRoleService) {}

	async handle({ params, response, bouncer }: HttpContext) {
		const { roleId } = params;

		await bouncer.with(DeleteRolePolicy).authorize("handle", roleId);

		await this.deleteRoleService.handle(roleId);

		return response.noContent();
	}
}
