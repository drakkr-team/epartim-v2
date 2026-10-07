import { createHash } from "node:crypto";

import { inject } from "@adonisjs/core";
import logger from "@adonisjs/core/services/logger";
import db from "@adonisjs/lucid/services/db";
import type { TransactionClientContract } from "@adonisjs/lucid/types/database";
import { ValidationError } from "@vinejs/vine";
import type { Infer } from "@vinejs/vine/types";
import { DateTime } from "luxon";

import InpiPreviewExpiredException from "#exceptions/inpi_preview_expired.exception";
import ChangeSubscriptionCompanyService from "#features/client/subscriptions/services/company_change.service";
import PreviewSubscriptionInpiService from "#features/client/subscriptions/services/inpi/preview.service";
import { SubscriptionStep } from "#features/client/subscriptions/services/steps/step.types";
import ValidateSubscriptionStepService from "#features/client/subscriptions/services/steps/validate.service";
import Address from "#models/address";
import Company, { type CompanyLegalForm } from "#models/company";
import CompanyBeneficialOwner from "#models/company_beneficial_owner";
import CompanyBeneficialOwnerRole from "#models/company_beneficial_owner_role";
import Contact from "#models/contact";
import Subscription from "#models/subscription";
import type { InpiPerson } from "#services/inpi/types";
import { ApplySubscriptionInpiSchema } from "#validators/subscription/inpi.validator";

export type ApplySubscriptionInpiPayload = Infer<typeof ApplySubscriptionInpiSchema>;

@inject()
export default class ApplySubscriptionInpiService {
	constructor(
		protected previewService: PreviewSubscriptionInpiService,
		protected companyChangeService: ChangeSubscriptionCompanyService,
		protected validateStepService: ValidateSubscriptionStepService,
	) {}

	async handle(subscription: Subscription, payload: ApplySubscriptionInpiPayload) {
		this.companyChangeService.assertEditable(subscription);
		const selectionHash = createHash("sha256")
			.update(
				JSON.stringify({
					fields: [...payload.fields].sort(),
					ownerIds: [...payload.ownerIds].sort(),
					legalAgentId: payload.legalAgentId ?? null,
					confirmCompanyChange: payload.confirmCompanyChange ?? false,
				}),
			)
			.digest("hex");
		const claim = await this.previewService.claim(
			subscription.id,
			payload.previewId,
			selectionHash,
		);
		if (claim.result) return claim.result;
		const preview = claim.preview!;
		const result = await db.transaction(async (trx) => {
			const current = await Subscription.query({ client: trx })
				.where("id", subscription.id)
				.forUpdate()
				.firstOrFail();
			this.companyChangeService.assertEditable(current);
			if (preview.revision !== current.editRevision) throw new InpiPreviewExpiredException();
			const validFields = payload.fields.every((field) => preview.values[field] !== null);
			const validOwners = payload.ownerIds.every((id) =>
				preview.people.some((person) => person.id === id),
			);
			const legalAgent = preview.people.find((person) => person.id === payload.legalAgentId);
			if (!validFields || !validOwners || (payload.legalAgentId && !legalAgent)) {
				throw new ValidationError([
					{
						field: "previewId",
						rule: "selection",
						message: "La sélection ne correspond pas à cet aperçu.",
					},
				]);
			}
			const company = await Company.findByOrFail("subscriptionId", current.id, { client: trx });
			const sirenChanged = company.siren !== preview.siren;
			const companyChanged = await this.companyChangeService.handle(
				current,
				company,
				preview.siren,
				payload.confirmCompanyChange ?? false,
				trx,
			);
			const values = preview.values;
			for (const field of payload.fields) {
				if (field === "legalForm") company.legalForm = values.legalForm as CompanyLegalForm;
				else if (!field.startsWith("address")) {
					const value = values[field];
					if (typeof value === "string") company.merge({ [field]: value });
				}
			}
			if (payload.fields.some((field) => field.startsWith("address"))) {
				const address = company.addressId
					? await Address.findOrFail(company.addressId, { client: trx })
					: new Address();
				const fields = {
					addressLineOne: "lineOne",
					addressLineTwo: "lineTwo",
					addressZip: "zip",
					addressCity: "city",
				} as const;
				for (const [key, field] of Object.entries(fields)) {
					const source = key as keyof typeof fields;
					if (payload.fields.includes(source)) address.merge({ [field]: values[source] });
				}
				await address.useTransaction(trx).save();
				company.addressId = address.id;
			}
			if (legalAgent) await this.#applyLegalAgent(company, legalAgent, trx);
			await company.useTransaction(trx).save();
			const createdOwnerIds: number[] = [];
			for (const person of preview.people.filter((candidate) =>
				payload.ownerIds.includes(candidate.id),
			)) {
				createdOwnerIds.push(await this.#createOwner(company.id, person, trx));
			}
			if (payload.fields.length || legalAgent || sirenChanged) {
				await this.validateStepService.invalidate(
					current,
					trx,
					SubscriptionStep.COMPANY_REFERENCES,
				);
			}
			if (createdOwnerIds.length)
				await this.validateStepService.invalidate(current, trx, SubscriptionStep.KYC);
			return { subscriptionId: current.id, companyChanged, createdOwnerIds };
		});
		try {
			await this.previewService.complete(preview.id, selectionHash, result);
		} catch {
			// The consumed preview cannot be replayed after an uncertain cache write.
			logger.warn({ subscriptionId: subscription.id }, "INPI result cache could not be updated");
		}
		return result;
	}

	async #applyLegalAgent(company: Company, person: InpiPerson, trx: TransactionClientContract) {
		const contact = company.companyLegalAgentId
			? await Contact.findOrFail(company.companyLegalAgentId, { client: trx })
			: new Contact();
		// Only registry identity fields change. Coordinates and existing documents are user-reviewed.
		await contact
			.useTransaction(trx)
			.merge({
				kind: person.kind,
				civility: person.civility,
				firstName: person.firstName,
				lastName: person.lastName,
				legalName: person.legalName,
				...(person.function === null ? {} : { function: person.function }),
			})
			.save();
		company.companyLegalAgentId = contact.id;
	}

	async #createOwner(companyId: number, person: InpiPerson, trx: TransactionClientContract) {
		const address = await Address.create(person.address, { client: trx });
		const owner = await CompanyBeneficialOwner.create(
			{
				companyId,
				addressId: address.id,
				kind: person.kind,
				firstName: person.firstName,
				lastName: person.lastName,
				legalName: person.legalName,
				siren: person.siren,
				function: person.functionLabel,
				birthDate: person.birthDate ? DateTime.fromISO(person.birthDate) : null,
				birthCity: person.birthCity,
				nationality: person.nationality,
				shareholdingPercentage: null,
			},
			{ client: trx },
		);
		if (person.roles.length)
			await CompanyBeneficialOwnerRole.createMany(
				person.roles.map((role) => ({ companyBeneficialOwnerId: owner.id, role })),
				{ client: trx },
			);
		return owner.id;
	}
}
