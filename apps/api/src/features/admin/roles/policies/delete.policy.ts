import { BasePolicy } from "@adonisjs/bouncer";
import { inject } from "@adonisjs/core";

import DeleteRoleService from "#features/admin/roles/services/delete.service";
import Admin from "#models/admin";
import User from "#models/user";

@inject()
export default class DeleteRolePolicy extends BasePolicy {
	constructor(protected deleteRoleService: DeleteRoleService) {
		super();
	}

	async handle(currentUser: Admin | User, roleId: bigint | number | string) {
		if (currentUser instanceof User) return false;

		return (await currentUser.can("delete:role")) && this.deleteRoleService.canDelete(roleId);
	}
}
