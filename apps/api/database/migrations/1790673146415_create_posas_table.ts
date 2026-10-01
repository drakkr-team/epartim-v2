import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "posas";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id");

			table
				.string("company_id")
				.notNullable()
				.references("amundi_id")
				.inTable("companies")
				.onDelete("CASCADE");

			table.integer("contract_type").unsigned().notNullable();
			table.integer("fund").unsigned().notNullable();
			table.float("rate").notNullable();
			table.float("available_shares").notNullable();
			table.float("unavailable_shares").notNullable();
			table.date("valuation_date").notNullable();

			table.unique(["company_id", "contract_type", "fund", "valuation_date"]);

			table.timestamps(true, true);
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
