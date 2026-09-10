import { HttpContext } from "@adonisjs/core/http";

import DeleteRolePolicy from "#features/admin/roles/policies/delete.policy";
import Role from "#models/role";

export default class DeleteRoleController {
	async handle({ params, response, bouncer }: HttpContext) {
		const { roleId } = params;

		await bouncer.with(DeleteRolePolicy).authorize("handle");

		const role = await Role.findOrFail(roleId);
		await role.delete();

		return response.noContent();
	}
}
