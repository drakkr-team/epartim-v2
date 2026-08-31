import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "firms";

	async up() {
		this.schema.alterTable(this.tableName, (table) => {
			table.unique(["orias"], {
				indexName: "firms_orias_unique",
			});
		});
	}

	async down() {
		this.schema.alterTable(this.tableName, (table) => {
			table.dropUnique(["orias"], "firms_orias_unique");
		});
	}
}
