import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "company_contacts";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id").notNullable();

			table
				.integer("company_id")
				.nullable()
				.references("id")
				.inTable("companies")
				.onDelete("CASCADE");
			table
				.integer("contact_id")
				.nullable()
				.references("id")
				.inTable("contacts")
				.onDelete("CASCADE");
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
