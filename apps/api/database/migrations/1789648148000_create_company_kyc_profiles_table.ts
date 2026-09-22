import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "company_kyc_profiles";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id").notNullable();
			table
				.integer("company_id")
				.notNullable()
				.unique()
				.references("id")
				.inTable("companies")
				.onDelete("CASCADE");

			table.boolean("regulated_activity").notNullable().defaultTo(false);
			table.string("regulated_activity_reference", 254).nullable();
			table.boolean("listed_company").notNullable().defaultTo(false);
			table.string("listed_company_reference", 254).nullable();
			table.boolean("bic_id").notNullable().defaultTo(false);
			table.boolean("bearer_bonds_structure").notNullable().defaultTo(false);
			table.decimal("bearer_bonds_structure_percentage", 5, 2).nullable();

			for (const field of ["country_of_activity", "country_provider", "main_markets"]) {
				table.string(field, 32).notNullable().defaultTo("france_and_eu");
				table.string(`${field}_reference`, 254).nullable();
			}

			table.timestamps(true, true);
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
