import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "companies";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id").notNullable();

			table
				.integer("subscription_id")
				.nullable()
				.unique()
				.references("id")
				.inTable("subscriptions")
				.onDelete("CASCADE");
			table
				.integer("address_id")
				.nullable()
				.unique()
				.references("id")
				.inTable("addresses")
				.onDelete("RESTRICT");
			table
				.integer("payment_detail_id")
				.nullable()
				.unique()
				.references("id")
				.inTable("payment_details")
				.onDelete("RESTRICT");
			table.integer("company_legal_agent_id").nullable();
			table.string("siret", 255).nullable();
			table.string("siren", 255).nullable();
			table.string("naf", 255).nullable();
			table.string("name", 255).nullable();
			table.string("legal_form", 255).nullable();
			table.string("company_headcount", 255).nullable();
			table.string("vat_number", 255).nullable();
			table.string("financial_year_closing_day", 255).nullable();

			// Document persistence is introduced with the DocuSign scope.
			table.integer("bank_details_document_id").nullable();
			table.integer("company_details_document_id").nullable();
			table.integer("legal_agent_id_document_id").nullable();
			table.integer("contacts_status_document_id").nullable();

			table.timestamps(true, true);
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
