import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	async up() {
		this.schema.alterTable("subscription_plans", (table) => {
			table.smallint("voluntary_participation_duration").nullable();
			table.date("voluntary_participation_start_date").nullable();
			table.date("voluntary_participation_end_date").nullable();
			table.smallint("voluntary_participation_minimum_seniority_months").nullable();
			table.integer("voluntary_participation_salary_basis_points").nullable();
			table.integer("voluntary_participation_presence_basis_points").nullable();
			table.integer("voluntary_participation_equal_basis_points").nullable();
			table.smallint("voluntary_participation_formula").nullable();
		});
	}

	async down() {
		this.schema.alterTable("subscription_plans", (table) => {
			table.dropColumns(
				"voluntary_participation_duration",
				"voluntary_participation_start_date",
				"voluntary_participation_end_date",
				"voluntary_participation_minimum_seniority_months",
				"voluntary_participation_salary_basis_points",
				"voluntary_participation_presence_basis_points",
				"voluntary_participation_equal_basis_points",
				"voluntary_participation_formula",
			);
		});
	}
}
