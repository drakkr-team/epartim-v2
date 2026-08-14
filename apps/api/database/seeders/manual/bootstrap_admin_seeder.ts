import { BaseSeeder } from "@adonisjs/lucid/seeders";

import Role from "#models/role";
import User from "#models/user";
import env from "#start/env";

export default class BootstrapAdminSeeder extends BaseSeeder {
	static environment = ["manual"];

	async run() {
		const email = env.get("BOOTSTRAP_ADMIN_EMAIL");
		const password = env.get("BOOTSTRAP_ADMIN_PASSWORD");
		const firstName = env.get("BOOTSTRAP_ADMIN_FIRST_NAME") || "Administrateur";
		const lastName = env.get("BOOTSTRAP_ADMIN_LAST_NAME") || "Epartim";

		if (!email || !password) {
			throw new Error("BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD must be configured.");
		}

		const user = await User.updateOrCreate(
			{ email: email.toLowerCase() },
			{
				name: `${firstName} ${lastName}`,
				email: email.toLowerCase(),
				password,
				firstName,
				lastName,
				status: "active",
				disabledAt: null,
			},
		);
		const administratorRole = await Role.updateOrCreate(
			{ code: "administrator" },
			{ code: "administrator", name: "Administrateur" },
		);
		await user.related("roles").sync([administratorRole.id]);
	}
}
