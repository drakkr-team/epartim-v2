import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	async up() {
		this.schema.alterTable("subscriptions", (table) => {
			table.integer("edit_revision").notNullable().defaultTo(0);
		});
	}

	async down() {
		this.schema.alterTable("subscriptions", (table) => table.dropColumn("edit_revision"));
	}
}
