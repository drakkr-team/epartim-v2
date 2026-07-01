import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "users";

	async up() {
		await this.schema.alterTable(this.tableName, (table) => {
			table.integer("firm_id").unsigned().nullable();
			table.string("first_name").nullable();
			table.string("last_name").nullable();
			table.string("mobile_phone").nullable();
			table.string("status").notNullable().defaultTo("active");
			table.string("amundi_user_id").nullable();
			table.string("amundi_employee_type").nullable().defaultTo("conseiller_pdf");
			table.string("partnership_provider").nullable();
			table.timestamp("last_login_at").nullable();
			table.timestamp("disabled_at").nullable();
		});

		await this.schema.raw(`
			ALTER TABLE "${this.tableName}"
			ADD CONSTRAINT "users_status_check"
			CHECK ("status" IN ('invited', 'active', 'disabled'))
		`);

		await this.schema.raw(`
			ALTER TABLE "${this.tableName}"
			ADD CONSTRAINT "users_partnership_provider_check"
			CHECK ("partnership_provider" IS NULL OR "partnership_provider" IN ('lilycare'))
		`);

		await this.schema.alterTable(this.tableName, (table) => {
			table.string("password").nullable().alter();
			table.index(["firm_id"], "idx_users_firm_id");
			table.index(["status"], "idx_users_status");
			table.index(["partnership_provider"], "idx_users_partnership_provider");
		});

		await this.schema.raw(`
			ALTER TABLE "${this.tableName}"
			ALTER COLUMN "status" SET DEFAULT 'invited'
		`);
	}

	async down() {
		await this.schema.raw(`
			ALTER TABLE "${this.tableName}"
			ALTER COLUMN "status" SET DEFAULT 'active'
		`);

		await this.schema.raw(`
			UPDATE "${this.tableName}"
			SET "password" = ''
			WHERE "password" IS NULL
		`);

		await this.schema.alterTable(this.tableName, (table) => {
			table.dropIndex(["partnership_provider"], "idx_users_partnership_provider");
			table.dropIndex(["status"], "idx_users_status");
			table.dropIndex(["firm_id"], "idx_users_firm_id");
			table.string("password").notNullable().alter();
		});

		await this.schema.raw(`
			ALTER TABLE "${this.tableName}"
			DROP CONSTRAINT "users_partnership_provider_check"
		`);

		await this.schema.raw(`
			ALTER TABLE "${this.tableName}"
			DROP CONSTRAINT "users_status_check"
		`);

		await this.schema.alterTable(this.tableName, (table) => {
			table.dropColumn("disabled_at");
			table.dropColumn("last_login_at");
			table.dropColumn("partnership_provider");
			table.dropColumn("amundi_employee_type");
			table.dropColumn("amundi_user_id");
			table.dropColumn("status");
			table.dropColumn("mobile_phone");
			table.dropColumn("last_name");
			table.dropColumn("first_name");
			table.dropColumn("firm_id");
		});
	}
}
