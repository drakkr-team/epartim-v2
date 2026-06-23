import { BaseCommand } from "@adonisjs/core/ace";
import type { CommandOptions } from "@adonisjs/core/types/ace";
import vine from "@vinejs/vine";

import { UserFactory } from "#database/factories/user.factory";

export default class CreateAccount extends BaseCommand {
	static commandName = "create:account";
	static description = "Create a new account";

	static options: CommandOptions = {
		startApp: true,
	};

	name: string | null = null;
	email: string | null = null;
	password: string | null = null;

	async interact() {
		this.name = await this.prompt.ask("Enter full name for the new account:");
		this.email = await this.prompt.ask("Enter email for the new account:", {
			validate: async (email) => {
				const [error] = await vine
					.create(
						vine.string().email().unique({
							table: "users",
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
		if (!this.email || !this.password || !this.name) {
			return this.logger.error("Full name, email, and password are required to create an account.");
		}

		await UserFactory.merge({
			name: this.name,
			email: this.email,
			password: this.password,
		}).create();

		this.logger.success(`Account created successfully for ${this.email}`);
	}
}
