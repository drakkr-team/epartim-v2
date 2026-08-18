import { BaseSeeder } from "@adonisjs/lucid/seeders";

import Role from "#models/role";

const roles = [
	{ code: "commercial", name: "Commercial GO/Epartim" },
	{ code: "network_manager", name: "Manager réseau" },
	{ code: "distributor", name: "Distributeur" },
] as const;

export default class AccessControlSeeder extends BaseSeeder {
	async run() {
		for (const role of roles) {
			await Role.updateOrCreate({ code: role.code }, role);
		}
	}
}
