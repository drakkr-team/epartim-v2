import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	async up() {
		this.schema.alterTable("subscription_documents", (table) => {
			table.string("inpi_act_id").nullable();
			table.string("inpi_siren", 9).nullable();
		});
	}

	async down() {
		this.schema.alterTable("subscription_documents", (table) => {
			table.dropColumns("inpi_act_id", "inpi_siren");
		});
	}
}
