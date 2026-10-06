import { inject } from "@adonisjs/core";
import db from "@adonisjs/lucid/services/db";
import type { TransactionClientContract } from "@adonisjs/lucid/types/database";
import { ValidationError } from "@vinejs/vine";
import type { Infer } from "@vinejs/vine/types";
import { parse } from "csv/sync";

import SubscriptionFormalismService, {
	formalismError,
} from "#features/client/subscriptions/services/update/formalism/formalism.service";
import type Subscription from "#models/subscription";
import SubscriptionFormalismEmployee from "#models/subscription_formalism_employee";
import { presentFormalismPerson } from "#presenters/subscription_formalism.presenter";
import {
	ImportedFormalismEmployeeSchema,
	type UpdateFormalismPersonSchema,
} from "#validators/subscription/formalism.validator";

type EmployeeInput = { firstName: string; lastName: string; email: string };
type CsvRecord = { record: string[]; info: { lines: number } };

@inject()
export default class SubscriptionFormalismEmployeesService {
	constructor(protected formalismService: SubscriptionFormalismService) {}
	async create(subscription: Subscription) {
		return db.transaction(async (trx) => {
			await this.formalismService.lock(subscription, trx);
			await this.formalismService.requireRatification(subscription, trx);
			const employee = await SubscriptionFormalismEmployee.create(
				{ subscriptionId: subscription.id },
				{ client: trx },
			);
			await this.formalismService.invalidate(subscription, trx);
			return presentFormalismPerson(employee);
		});
	}
	async update(
		subscription: Subscription,
		employeeId: number,
		payload: Infer<typeof UpdateFormalismPersonSchema>,
	) {
		return db.transaction(async (trx) => {
			await this.formalismService.lock(subscription, trx);
			await this.formalismService.requireRatification(subscription, trx);
			const employee = await this.find(subscription.id, employeeId, trx);
			if (payload.email) {
				const duplicate = await SubscriptionFormalismEmployee.query({ client: trx })
					.where("subscriptionId", subscription.id)
					.where("email", payload.email)
					.whereNot("id", employeeId)
					.first();
				if (duplicate)
					formalismError("email", "Cette adresse email est déjà utilisée par un salarié.");
			}
			await employee.useTransaction(trx).merge(payload).save();
			await this.formalismService.invalidate(subscription, trx);
			return presentFormalismPerson(employee);
		});
	}
	async delete(subscription: Subscription, employeeId: number) {
		await db.transaction(async (trx) => {
			await this.formalismService.lock(subscription, trx);
			await this.formalismService.requireRatification(subscription, trx);
			const employee = await this.find(subscription.id, employeeId, trx);
			await employee.useTransaction(trx).delete();
			await this.formalismService.invalidate(subscription, trx);
		});
	}
	async import(subscription: Subscription, content: string) {
		const rows = this.parseCsv(content);
		const errors: { field: string; message: string; rule: string }[] = [];
		const validated: { employee: EmployeeInput; line: number }[] = [];
		for (const row of rows) {
			try {
				const employee = await ImportedFormalismEmployeeSchema.validate(row.employee);
				validated.push({ employee, line: row.line });
			} catch (error) {
				if (!(error instanceof ValidationError)) throw error;
				errors.push({
					field: `file.${row.line}`,
					message: `Ligne ${row.line} : renseignez un nom, un prénom (254 caractères maximum) et un email valide.`,
					rule: "csv",
				});
			}
		}
		if (errors.length > 0) throw new ValidationError(errors);
		return db.transaction(async (trx) => {
			await this.formalismService.lock(subscription, trx);
			await this.formalismService.requireRatification(subscription, trx);
			const existing = await SubscriptionFormalismEmployee.query({ client: trx })
				.where("subscriptionId", subscription.id)
				.orderBy("id");
			const byEmail = new Map(
				existing.filter((employee) => employee.email).map((employee) => [employee.email, employee]),
			);
			const additions = new Map<string, EmployeeInput>();
			let skipped = 0;
			for (const { employee, line } of validated) {
				const previous = byEmail.get(employee.email) ?? additions.get(employee.email);
				if (!previous) additions.set(employee.email, employee);
				else if (
					previous.firstName === employee.firstName &&
					previous.lastName === employee.lastName
				)
					skipped++;
				else
					errors.push({
						field: `file.${line}`,
						message: `Ligne ${line} : cet email est associé à une autre identité.`,
						rule: "distinct",
					});
			}
			if (errors.length > 0) throw new ValidationError(errors);
			const added = await SubscriptionFormalismEmployee.createMany(
				[...additions.values()].map((employee) => ({
					...employee,
					subscriptionId: subscription.id,
				})),
				{ client: trx },
			);
			if (added.length > 0) await this.formalismService.invalidate(subscription, trx);
			return {
				added: added.length,
				skipped,
				employees: [...existing, ...added].map(presentFormalismPerson),
			};
		});
	}

	private find(subscriptionId: number, employeeId: number, trx: TransactionClientContract) {
		return SubscriptionFormalismEmployee.query({ client: trx })
			.where("subscriptionId", subscriptionId)
			.where("id", employeeId)
			.firstOrFail();
	}
	private parseCsv(content: string) {
		let rows: CsvRecord[] | undefined;
		let headers: string[] = [];
		for (const delimiter of [",", ";"]) {
			const parsed: CsvRecord[] = [];
			try {
				parse(content, {
					delimiter,
					bom: true,
					skip_empty_lines: true,
					trim: true,
					relax_column_count: true,
					on_record: (record, info) => {
						parsed.push({ record, info: { lines: info.lines } });
						return record;
					},
				});
				const candidate =
					parsed[0]?.record.map((header) =>
						header
							.trim()
							.toLowerCase()
							.normalize("NFD")
							.replace(/\p{Diacritic}/gu, ""),
					) ?? [];
				if (
					candidate.length === 3 &&
					["nom", "prenom", "email"].every((header) => candidate.includes(header))
				) {
					rows = parsed.slice(1);
					headers = candidate;
					break;
				}
			} catch (error) {
				if (
					error instanceof Error &&
					"lines" in error &&
					typeof error.lines === "number" &&
					parsed[0]?.record.length === 3
				) {
					formalismError("file", `Ligne ${error.lines} : le format CSV est invalide.`);
				}
				// Try the other supported separator before rejecting the file.
			}
		}
		if (!rows)
			formalismError(
				"file",
				"Le CSV doit contenir les colonnes nom, prénom, email et utiliser une virgule ou un point-virgule comme séparateur.",
			);
		if (rows.length === 0) formalismError("file", "Le fichier ne contient aucun salarié.");
		const malformed = rows.filter((row) => row.record.length !== 3);
		if (malformed.length > 0)
			throw new ValidationError(
				malformed.map((row) => ({
					field: `file.${row.info.lines}`,
					message: `Ligne ${row.info.lines} : trois colonnes sont attendues.`,
					rule: "csv",
				})),
			);
		return rows.map((row) => ({
			line: row.info.lines,
			employee: {
				lastName: row.record[headers.indexOf("nom")],
				firstName: row.record[headers.indexOf("prenom")],
				email: row.record[headers.indexOf("email")],
			},
		}));
	}
}
