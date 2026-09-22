import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "users";

	async up() {
		this.schema.alterTable(this.tableName, (table) => {
			table.integer("role").defaultTo(0).notNullable();
			table.integer("firm_id").references("id").inTable("firms").onDelete("SET NULL").nullable();
		});
	}

	async down() {
		this.schema.alterTable(this.tableName, (table) => {
			table.dropColumn("role");
			table.dropColumn("firm_id");
		});
	}
}
