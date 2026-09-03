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
			table
				.integer("company_legal_agent_id")
				.nullable()
				.references("id")
				.inTable("contacts")
				.onDelete("RESTRICT");
			table
				.integer("company_correspondent_id")
				.nullable()
				.references("id")
				.inTable("contacts")
				.onDelete("RESTRICT");
			table.string("siret", 255).nullable();
			table.string("siren", 255).nullable();
			table.string("naf", 255).nullable();
			table.string("name", 255).nullable();
			table.integer("legal_form").unsigned().nullable();
			table.string("company_headcount", 255).nullable();
			table.string("vat_number", 255).nullable();
			table.string("financial_year_closing_day", 12).nullable();

			table
				.integer("bank_details_document_id")
				.nullable()
				.references("id")
				.inTable("files")
				.onDelete("RESTRICT");
			table
				.integer("company_details_document_id")
				.nullable()
				.references("id")
				.inTable("files")
				.onDelete("RESTRICT");
			table
				.integer("legal_agent_id_document_id")
				.nullable()
				.references("id")
				.inTable("files")
				.onDelete("RESTRICT");
			table
				.integer("contacts_status_document_id")
				.nullable()
				.references("id")
				.inTable("files")
				.onDelete("RESTRICT");

			table.timestamps(true, true);
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
