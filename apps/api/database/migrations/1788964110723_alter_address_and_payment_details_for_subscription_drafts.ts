import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	async up() {
		this.schema.alterTable("addresses", (table) => {
			table.string("line_one", 254).nullable().alter();
			table.string("zip", 254).nullable().alter();
			table.string("city", 254).nullable().alter();
		});

		this.schema.alterTable("payment_details", (table) => {
			table.string("iban", 254).nullable().alter();
			table.string("bic", 254).nullable().alter();
		});
	}

	async down() {
		this.schema.alterTable("addresses", (table) => {
			table.string("line_one", 254).notNullable().alter();
			table.string("zip", 254).notNullable().alter();
			table.string("city", 254).notNullable().alter();
		});

		this.schema.alterTable("payment_details", (table) => {
			table.string("iban", 254).notNullable().alter();
			table.string("bic", 254).notNullable().alter();
		});
	}
}
