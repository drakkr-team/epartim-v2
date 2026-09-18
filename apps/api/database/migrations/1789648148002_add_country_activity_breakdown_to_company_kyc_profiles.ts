import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "company_kyc_profiles";

	async up() {
		this.schema.alterTable(this.tableName, (table) => {
			table.jsonb("country_of_activity_breakdown").nullable();
		});
	}

	async down() {
		this.schema.alterTable(this.tableName, (table) => {
			table.dropColumn("country_of_activity_breakdown");
		});
	}
}
