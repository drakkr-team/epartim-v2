import { BasePolicy } from "@adonisjs/bouncer";
import { inject } from "@adonisjs/core";

import DeleteRoleService from "#features/admin/roles/services/delete.service";
import Admin from "#models/admin";
import Role from "#models/role";
import User from "#models/user";

@inject()
export default class DeleteRolePolicy extends BasePolicy {
	constructor(protected deleteRoleService: DeleteRoleService) {
		super();
	}

	async handle(currentUser: Admin | User, role: Role) {
		if (currentUser instanceof User) return false;

		const currentRole = await Role.find(currentUser.roleId);

		return (currentRole?.isSuperAdmin ?? false) && this.deleteRoleService.canDelete(role);
	}
}
