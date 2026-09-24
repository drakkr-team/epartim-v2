import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "subscription_documents";

	async up() {
		this.schema.alterTable(this.tableName, (table) => {
			table
				.integer("company_beneficial_owner_id")
				.nullable()
				.references("id")
				.inTable("company_beneficial_owners")
				.onDelete("CASCADE");
			table.dropUnique(["subscription_id", "type"]);
			table.unique(["subscription_id", "type", "company_beneficial_owner_id"]);
		});
	}

	async down() {
		this.schema.alterTable(this.tableName, (table) => {
			table.dropUnique(["subscription_id", "type", "company_beneficial_owner_id"]);
			table.dropColumn("company_beneficial_owner_id");
			table.unique(["subscription_id", "type"]);
		});
	}
}
