import type { TransactionClientContract } from "@adonisjs/lucid/types/database";

import Company, { CompanyLegalForm } from "#models/company";
import Contact, { ContactKind } from "#models/contact";
import Subscription from "#models/subscription";
import SubscriptionDocument, {
	SubscriptionDocumentType,
	type SubscriptionDocumentType as SubscriptionDocumentTypeValue,
} from "#models/subscription_document";

export type SubscriptionDocumentRequirement = {
	document: SubscriptionDocument | null;
	label: string;
	type: SubscriptionDocumentTypeValue;
};

export default class SubscriptionDocumentRequirementsService {
	async handle(subscription: Subscription, options?: { trx?: TransactionClientContract }) {
		const client = options?.trx;
		const company = await Company.findByOrFail("subscriptionId", subscription.id, { client });
		const transactionCompany = client ? company.useTransaction(client) : company;
		const transactionSubscription = client ? subscription.useTransaction(client) : subscription;
		const legalAgent = await transactionCompany.related("legalAgent").query().first();
		const signer = await transactionCompany.related("signer").query().first();
		const documents = await transactionSubscription.related("documents").query().preload("file");

		return this.#resolve({ company, documents, legalAgent, signer });
	}

	#resolve(params: {
		company: Company;
		documents: SubscriptionDocument[];
		legalAgent: Contact | null;
		signer: Contact | null;
	}) {
		const { company, documents, legalAgent, signer } = params;
		const documentsByType = new Map(documents.map((document) => [document.type, document]));
		const requirements: Array<Pick<SubscriptionDocumentRequirement, "label" | "type">> = [
			{
				type: SubscriptionDocumentType.BANK_DETAILS,
				label: "Relevé d'identité bancaire (RIB)",
			},
		];

		if (legalAgent?.kind !== ContactKind.PERSONNE_MORALE) {
			requirements.push({
				type: SubscriptionDocumentType.LEGAL_AGENT_ID,
				label: "Pièce d'identité du représentant légal",
			});
		} else {
			requirements.push({
				type: SubscriptionDocumentType.LEGAL_AGENT_KBIS,
				label: "Kbis du représentant légal",
			});
		}

		const legalForm = company.legalForm as CompanyLegalForm | null;

		if (legalForm) {
			requirements.push({
				type: SubscriptionDocumentType.EXISTENCE_PROOF,
				label: this.#existenceProofLabel(legalForm),
			});

			if (this.#requiresOrganizationChart(legalForm)) {
				requirements.push({
					type: SubscriptionDocumentType.ORGANIZATION_CHART,
					label: "Organigramme",
				});
			}

			if (
				legalForm !== CompanyLegalForm.ENTREPRISE_INDIVIDUELLE &&
				legalForm !== CompanyLegalForm.PROFESSION_LIBERALE
			) {
				requirements.push({
					type: SubscriptionDocumentType.ARTICLES_OF_ASSOCIATION,
					label: "Statuts signés à jour",
				});
			}
		}

		if (signer?.isSignatoryOnKbis === false) {
			requirements.push(
				{
					type: SubscriptionDocumentType.SIGNER_ID,
					label: "Pièce d'identité du signataire",
				},
				{
					type: SubscriptionDocumentType.SIGNER_POWER,
					label: "Pouvoir donné au signataire",
				},
			);
		}

		return requirements.map((requirement) => ({
			...requirement,
			document: documentsByType.get(requirement.type) ?? null,
		}));
	}

	#requiresOrganizationChart(legalForm: CompanyLegalForm) {
		const legalForms: CompanyLegalForm[] = [
			CompanyLegalForm.ASSOCIATION,
			CompanyLegalForm.ENTREPRISE_ASSURANCES_OU_MUTUELLE_CODE_ASSURANCES,
			CompanyLegalForm.SYNDICAT,
			CompanyLegalForm.ORGANISME_PUBLIC,
			CompanyLegalForm.ETABLISSEMENTS_PUBLICS_LOCAUX_REGIE_PERSONNALISEE,
		];

		return legalForms.includes(legalForm);
	}

	#existenceProofLabel(legalForm: CompanyLegalForm) {
		switch (legalForm) {
			case CompanyLegalForm.ASSOCIATION:
				return "Extrait du Journal officiel ou récépissé de préfecture";
			case CompanyLegalForm.SCF:
				return "Attestation URSSAF de l'année en cours mentionnant le SIREN";
			case CompanyLegalForm.ENTREPRISE_INDIVIDUELLE:
				return "Kbis, carte professionnelle ou attestation URSSAF";
			case CompanyLegalForm.PROFESSION_LIBERALE:
				return "Carte professionnelle ou attestation URSSAF";
			case CompanyLegalForm.ENTREPRISE_ASSURANCES_OU_MUTUELLE_CODE_ASSURANCES:
				return "Agrément ou arrêté ministériel publié au Journal officiel";
			case CompanyLegalForm.SYNDICAT:
				return "Récépissé de mairie";
			case CompanyLegalForm.ETABLISSEMENTS_PUBLICS_LOCAUX_REGIE_PERSONNALISEE:
				return "Délibération de la collectivité territoriale";
			default:
				return "Extrait RNE ou équivalent Kbis de moins de trois mois, attestation du registre des métiers, carte professionnelle ou extrait du Journal officiel";
		}
	}
}
