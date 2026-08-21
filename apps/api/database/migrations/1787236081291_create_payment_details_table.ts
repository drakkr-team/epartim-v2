import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "payment_details";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.bigIncrements("id").notNullable();
			table.string("iban", 254).notNullable();
			table.string("bic", 254).notNullable();
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
