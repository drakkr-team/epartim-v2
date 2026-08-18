import { BaseSeeder } from "@adonisjs/lucid/seeders";

import AdminUser from "#models/admin_user";

export default class AdminUserSeeder extends BaseSeeder {
	static environment = ["manual"];

	async run() {
		await AdminUser.updateOrCreate(
			{ email: "admin@example.com" },
			{
				name: "Admin Epartim",
				email: "admin@example.com",
				password: "password123",
				status: "active",
				disabledAt: null,
			},
		);
	}
}
