import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "companies";

	async up() {
		this.schema.alterTable("contacts", (table) => {
			table.integer("civility").unsigned().nullable();
		});

		this.schema.alterTable(this.tableName, (table) => {
			table
				.integer("company_signer_id")
				.nullable()
				.references("id")
				.inTable("contacts")
				.onDelete("RESTRICT");
		});
	}

	async down() {
		this.schema.alterTable(this.tableName, (table) => {
			table.dropForeign(["company_signer_id"]);
			table.dropColumn("company_signer_id");
		});

		this.schema.alterTable("contacts", (table) => {
			table.dropColumn("civility");
		});
	}
}
