import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "contacts";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id").notNullable();

			table.string("kind", 255).nullable().index();
			table
				.integer("company_id")
				.nullable()
				.references("id")
				.inTable("companies")
				.onDelete("CASCADE");
			table.string("first_name", 255).nullable();
			table.string("last_name", 255).nullable();
			table.integer("function").unsigned().nullable();
			table.string("email", 255).nullable();
			table.string("phone_number", 255).nullable();
			table.string("amundi_portal_id", 255).nullable();
			table.boolean("is_signatory_on_kbis").nullable();
			table.boolean("is_same_as_legal").nullable();
			table.jsonb("authorizations").nullable();

			table.timestamps(true, true);
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
