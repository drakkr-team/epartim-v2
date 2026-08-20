import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";

import AdminUserService from "#features/admin/users/services/admin_user.service";

@inject()
export default class UserOptionsController {
	constructor(private adminUserService: AdminUserService) {}

	async handle(_: HttpContext) {
		const { roles, firms, networks } = await this.adminUserService.options();
		return {
			roles: roles.map((role) => ({ code: role.code, name: role.name })),
			firms: firms.map((firm) => ({
				id: firm.id,
				name: firm.name,
				network: firm.network ? { id: firm.network.id, name: firm.network.name } : null,
			})),
			networks: networks.map((network) => ({ id: network.id, name: network.name })),
		};
	}
}
