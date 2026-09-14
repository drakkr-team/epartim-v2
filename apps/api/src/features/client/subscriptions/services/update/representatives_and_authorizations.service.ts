import db from "@adonisjs/lucid/services/db";
import type { TransactionClientContract } from "@adonisjs/lucid/types/database";
import type { Infer } from "@vinejs/vine/types";

import Company from "#models/company";
import Contact, { ContactKind } from "#models/contact";
import Subscription from "#models/subscription";
import { UpdateRepresentativesAndAuthorizationsSchema } from "#validators/subscription/representatives_and_authorizations.validator";

export type UpdateRepresentativesAndAuthorizationsPayload = Infer<
	typeof UpdateRepresentativesAndAuthorizationsSchema
>;

type AuthorizationPayload = NonNullable<
	UpdateRepresentativesAndAuthorizationsPayload["authorizations"]
>[number];

const contactFields = [
	"civility",
	"firstName",
	"lastName",
	"legalName",
	"function",
	"email",
	"phoneNumber",
	"amundiPortalId",
	"isSignatoryOnKbis",
	"isSameAsLegal",
	"authorizations",
] as const;

type ContactField = (typeof contactFields)[number];

function definedContactChanges(payload: Record<string, unknown>) {
	return Object.fromEntries(
		contactFields
			.filter((field) => payload[field] !== undefined)
			.map((field) => [field, payload[field]]),
	) as Partial<Pick<Contact, ContactField>>;
}

function hasValues(payload: Record<string, unknown>) {
	return Object.values(payload).some((value) => value !== null && value !== undefined);
}

export default class UpdateRepresentativesAndAuthorizationsService {
	async handle(subscription: Subscription, payload: UpdateRepresentativesAndAuthorizationsPayload) {
		return db.transaction(async (trx) => {
			const company = await Company.findByOrFail("subscriptionId", subscription.id, {
				client: trx,
			});
			const legalAgent = await this.#updateLegalAgent(company, payload.legalAgent, trx);

			await this.#updateSigner(company, payload.signer, trx);
			await this.#updateCorrespondent(company, legalAgent, payload.correspondent, trx);

			if (payload.authorizations !== undefined) {
				await this.#replaceAuthorizations(company, payload.authorizations, trx);
			}

			return company;
		});
	}

	async #updateLegalAgent(
		company: Company,
		payload: UpdateRepresentativesAndAuthorizationsPayload["legalAgent"],
		trx: TransactionClientContract,
	) {
		if (payload === undefined) {
			return company.companyLegalAgentId
				? Contact.findOrFail(company.companyLegalAgentId, { client: trx })
				: null;
		}

		if (payload === null) {
			await this.#clearContact(company, "companyLegalAgentId", trx);
			return null;
		}

		const legalAgent = company.companyLegalAgentId
			? await Contact.findOrFail(company.companyLegalAgentId, { client: trx })
			: new Contact();

		legalAgent.merge(definedContactChanges(payload));
		if (payload.kind !== undefined) legalAgent.kind = payload.kind;
		this.#applyLegalAgentRules(legalAgent);
		await legalAgent.useTransaction(trx).save();

		if (!company.companyLegalAgentId) {
			await company.useTransaction(trx).merge({ companyLegalAgentId: legalAgent.id }).save();
		}

		return legalAgent;
	}

	async #updateSigner(
		company: Company,
		payload: UpdateRepresentativesAndAuthorizationsPayload["signer"],
		trx: TransactionClientContract,
	) {
		if (payload === undefined) return;

		if (payload === null) {
			await this.#clearContact(company, "companySignerId", trx);
			return;
		}

		if (!company.companySignerId && !hasValues(payload)) return;

		const signer = company.companySignerId
			? await Contact.findOrFail(company.companySignerId, { client: trx })
			: new Contact();

		signer.merge(definedContactChanges(payload));
		this.#applyPhysicalPersonRules(signer);
		signer.amundiPortalId = null;
		signer.authorizations = null;
		await signer.useTransaction(trx).save();

		if (!company.companySignerId) {
			await company.useTransaction(trx).merge({ companySignerId: signer.id }).save();
		}
	}

	async #updateCorrespondent(
		company: Company,
		legalAgent: Contact | null,
		payload: UpdateRepresentativesAndAuthorizationsPayload["correspondent"],
		trx: TransactionClientContract,
	) {
		if (!legalAgent) return;

		const isSameAsLegal =
			legalAgent.kind === ContactKind.PERSONNE_MORALE
				? false
				: (payload?.isSameAsLegal ?? legalAgent.isSameAsLegal);

		if (legalAgent.isSameAsLegal !== isSameAsLegal) {
			await legalAgent.useTransaction(trx).merge({ isSameAsLegal }).save();
		}

		if (isSameAsLegal !== false) {
			if (isSameAsLegal === true) {
				await this.#clearContact(company, "companyCorrespondentId", trx);
			}
			return;
		}

		const correspondent = company.companyCorrespondentId
			? await Contact.findOrFail(company.companyCorrespondentId, { client: trx })
			: new Contact();

		if (payload && payload !== null) {
			correspondent.merge(definedContactChanges(payload));
		}
		this.#applyPhysicalPersonRules(correspondent);
		correspondent.isSignatoryOnKbis = null;
		correspondent.authorizations = null;
		await correspondent.useTransaction(trx).save();

		if (!company.companyCorrespondentId) {
			await company.useTransaction(trx).merge({ companyCorrespondentId: correspondent.id }).save();
		}
	}

	async #replaceAuthorizations(
		company: Company,
		payload: AuthorizationPayload[],
		trx: TransactionClientContract,
	) {
		const existingAuthorizations = await company
			.useTransaction(trx)
			.related("contacts")
			.query()
			.whereNotNull("authorizations")
			.orderBy("contacts.id");
		const authorizationIds: number[] = [];

		for (const [index, authorizationPayload] of payload.entries()) {
			const authorization = existingAuthorizations[index] ?? new Contact();

			authorization.merge(definedContactChanges(authorizationPayload));
			this.#applyPhysicalPersonRules(authorization);
			authorization.isSignatoryOnKbis = null;
			authorization.authorizations = authorizationPayload.authorizations ?? [];
			await authorization.useTransaction(trx).save();
			authorizationIds.push(authorization.id);
		}

		const obsoleteAuthorizationIds = existingAuthorizations
			.slice(payload.length)
			.map((authorization) => authorization.id);

		await company.useTransaction(trx).related("contacts").sync(authorizationIds);

		if (obsoleteAuthorizationIds.length > 0) {
			await Contact.query({ client: trx }).whereIn("id", obsoleteAuthorizationIds).delete();
		}
	}

	async #clearContact(
		company: Company,
		foreignKey: "companyLegalAgentId" | "companyCorrespondentId" | "companySignerId",
		trx: TransactionClientContract,
	) {
		const contactId = company[foreignKey];
		if (!contactId) return;

		await company
			.useTransaction(trx)
			.merge({ [foreignKey]: null })
			.save();
		await Contact.query({ client: trx }).where("id", contactId).delete();
	}

	#applyLegalAgentRules(legalAgent: Contact) {
		legalAgent.amundiPortalId = null;
		legalAgent.isSignatoryOnKbis = null;
		legalAgent.authorizations = null;

		if (legalAgent.kind === ContactKind.PERSONNE_MORALE) {
			legalAgent.civility = null;
			legalAgent.firstName = null;
			legalAgent.lastName = null;
			legalAgent.phoneNumber = null;
			return;
		}

		if (legalAgent.kind === ContactKind.PERSONNE_PHYSIQUE) {
			legalAgent.legalName = null;
		}
	}

	#applyPhysicalPersonRules(contact: Contact) {
		contact.kind = ContactKind.PERSONNE_PHYSIQUE;
		contact.legalName = null;
		contact.isSameAsLegal = null;
		contact.isSignatoryOnKbis ??= null;
	}
}
