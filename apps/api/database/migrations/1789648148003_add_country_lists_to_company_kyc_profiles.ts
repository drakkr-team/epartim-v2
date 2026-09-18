import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "company_kyc_profiles";

	async up() {
		this.schema.alterTable(this.tableName, (table) => {
			table.jsonb("country_provider_countries").nullable();
			table.jsonb("main_markets_countries").nullable();
		});
	}

	async down() {
		this.schema.alterTable(this.tableName, (table) => {
			table.dropColumn("country_provider_countries");
			table.dropColumn("main_markets_countries");
		});
	}
}
