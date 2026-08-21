import { BaseCommand } from "@adonisjs/core/ace";
import { CommandOptions } from "@adonisjs/core/types/ace";
import vine from "@vinejs/vine";

import { AdminFactory } from "#database/factories/admin.factory";

export default class CreateAdmin extends BaseCommand {
	static commandName = "create:admin";
	static description = "Create a new admin account";

	static options: CommandOptions = {
		startApp: true,
	};

	email: string | null = null;
	password: string | null = null;

	async interact() {
		this.email = await this.prompt.ask("Enter email for the new account:", {
			validate: async (email) => {
				const [error] = await vine
					.create(
						vine.string().email().unique({
							table: "admins",
							column: "email",
						}),
					)
					.tryValidate(email);

				if (error) {
					return error.messages
						.map((msg: { message: string; rule: string; field: string }) => msg.message)
						.join(", ");
				}

				return true;
			},
		});
		this.password = await this.prompt.secure("Enter password for the new account:");
	}

	async run() {
		if (!this.email || !this.password) {
			return this.logger.error("Email and password are required to create an account.");
		}

		await AdminFactory.merge({
			email: this.email,
			password: this.password,
		}).create();

		this.logger.success(`Admin account created successfully for ${this.email}`);
	}
}
