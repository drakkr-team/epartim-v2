import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "company_beneficial_owners";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id").notNullable();
			table
				.integer("company_id")
				.notNullable()
				.references("id")
				.inTable("companies")
				.onDelete("CASCADE");
			table
				.integer("address_id")
				.notNullable()
				.unique()
				.references("id")
				.inTable("addresses")
				.onDelete("RESTRICT");

			table.integer("kind").unsigned().notNullable().defaultTo(1);
			table.string("first_name", 100).nullable();
			table.string("last_name", 100).nullable();
			table.string("legal_name", 254).nullable();
			table.string("function", 254).nullable();
			table.decimal("shareholding_percentage", 5, 2).nullable();
			table.string("siren", 9).nullable();
			table.date("birth_date").nullable();
			table.string("birth_city", 100).nullable();
			table.string("nationality", 2).nullable();

			table.timestamps(true, true);
		});

		this.schema.createTable("company_beneficial_owner_roles", (table) => {
			table.increments("id").notNullable();
			table
				.integer("company_beneficial_owner_id")
				.notNullable()
				.references("id")
				.inTable("company_beneficial_owners")
				.onDelete("CASCADE");
			table.integer("role").unsigned().notNullable();
			table.unique(["company_beneficial_owner_id", "role"]);
		});
	}

	async down() {
		this.schema.dropTable("company_beneficial_owner_roles");
		this.schema.dropTable(this.tableName);
	}
}
