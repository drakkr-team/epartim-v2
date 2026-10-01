import type { TransactionClientContract } from "@adonisjs/lucid/types/database";

import { SubscriptionAgreement } from "#constants/subscription_agreement";
import { SubscriptionStep } from "#features/client/subscriptions/services/steps/step.types";
import Company, { CompanyLegalForm } from "#models/company";
import CompanyBeneficialOwner, {
	CompanyBeneficialOwnerKind,
} from "#models/company_beneficial_owner";
import CompanyKycProfile from "#models/company_kyc_profile";
import Contact, { ContactKind } from "#models/contact";
import Subscription from "#models/subscription";
import SubscriptionDocument, {
	SubscriptionDocumentType,
	type SubscriptionDocumentType as SubscriptionDocumentTypeValue,
} from "#models/subscription_document";
import type SubscriptionExistingAgreement from "#models/subscription_existing_agreement";

export type SubscriptionDocumentRequirement = {
	document: SubscriptionDocument | null;
	label: string;
	ownerId: number | null;
	step: SubscriptionStep;
	type: SubscriptionDocumentTypeValue;
};

export default class SubscriptionDocumentRequirementsService {
	async handle(
		subscription: Subscription,
		options?: { step?: SubscriptionStep; trx?: TransactionClientContract },
	) {
		const client = options?.trx;
		const company = await Company.findByOrFail("subscriptionId", subscription.id, { client });
		const transactionCompany = client ? company.useTransaction(client) : company;
		const transactionSubscription = client ? subscription.useTransaction(client) : subscription;
		const legalAgent = await transactionCompany.related("legalAgent").query().first();
		const signer = await transactionCompany.related("signer").query().first();
		const kycProfile = await transactionCompany.related("kycProfile").query().first();
		const beneficialOwners = await transactionCompany
			.related("beneficialOwners")
			.query()
			.orderBy("company_beneficial_owners.id");
		const documents = await transactionSubscription.related("documents").query().preload("file");
		const existingAgreements = await transactionSubscription.related("existingAgreements").query();

		const requirements = this.#resolve({
			beneficialOwners,
			company,
			documents,
			existingAgreements,
			kycProfile,
			legalAgent,
			signer,
		});

		return options?.step === undefined
			? requirements
			: requirements.filter((requirement) => requirement.step === options.step);
	}

	#resolve(params: {
		beneficialOwners: CompanyBeneficialOwner[];
		company: Company;
		documents: SubscriptionDocument[];
		existingAgreements: SubscriptionExistingAgreement[];
		kycProfile: CompanyKycProfile | null;
		legalAgent: Contact | null;
		signer: Contact | null;
	}) {
		const {
			beneficialOwners,
			company,
			documents,
			existingAgreements,
			kycProfile,
			legalAgent,
			signer,
		} = params;
		const agreementTypes = existingAgreements.map((agreement) => agreement.type);
		const documentsByRequirement = new Map(
			documents.map((document) => [
				this.#documentKey(
					document.type as SubscriptionDocumentTypeValue,
					document.companyBeneficialOwnerId,
				),
				document,
			]),
		);
		const requirements: Array<
			Pick<SubscriptionDocumentRequirement, "label" | "ownerId" | "step" | "type">
		> = [
			{
				ownerId: null,
				step: SubscriptionStep.COMPANY_REFERENCES,
				type: SubscriptionDocumentType.BANK_DETAILS,
				label: "Relevé d'identité bancaire (RIB)",
			},
		];

		if (legalAgent?.kind !== ContactKind.PERSONNE_MORALE) {
			requirements.push({
				ownerId: null,
				step: SubscriptionStep.COMPANY_REFERENCES,
				type: SubscriptionDocumentType.LEGAL_AGENT_ID,
				label: "Pièce d'identité du représentant légal",
			});
		} else {
			requirements.push({
				ownerId: null,
				step: SubscriptionStep.COMPANY_REFERENCES,
				type: SubscriptionDocumentType.LEGAL_AGENT_KBIS,
				label: "Kbis du représentant légal",
			});
		}

		const legalForm = company.legalForm as CompanyLegalForm | null;

		if (legalForm) {
			requirements.push({
				ownerId: null,
				step: SubscriptionStep.COMPANY_REFERENCES,
				type: SubscriptionDocumentType.EXISTENCE_PROOF,
				label: this.#existenceProofLabel(legalForm),
			});

			if (this.#requiresOrganizationChart(legalForm)) {
				requirements.push({
					ownerId: null,
					step: SubscriptionStep.COMPANY_REFERENCES,
					type: SubscriptionDocumentType.ORGANIZATION_CHART,
					label: "Organigramme",
				});
			}

			if (
				legalForm !== CompanyLegalForm.ENTREPRISE_INDIVIDUELLE &&
				legalForm !== CompanyLegalForm.PROFESSION_LIBERALE
			) {
				requirements.push({
					ownerId: null,
					step: SubscriptionStep.COMPANY_REFERENCES,
					type: SubscriptionDocumentType.ARTICLES_OF_ASSOCIATION,
					label: "Statuts signés à jour",
				});
			}
		}

		if (signer?.isSignatoryOnKbis === false) {
			requirements.push(
				{
					ownerId: null,
					step: SubscriptionStep.COMPANY_REFERENCES,
					type: SubscriptionDocumentType.SIGNER_ID,
					label: "Pièce d'identité du signataire",
				},
				{
					ownerId: null,
					step: SubscriptionStep.COMPANY_REFERENCES,
					type: SubscriptionDocumentType.SIGNER_POWER,
					label: "Pouvoir donné au signataire",
				},
			);
		}

		if (kycProfile?.bicId) {
			requirements.push({
				label: "Code d’identification BIC",
				ownerId: null,
				step: SubscriptionStep.KYC,
				type: SubscriptionDocumentType.BIC_IDENTIFICATION_CODE,
			});
		}

		for (const owner of beneficialOwners) {
			requirements.push({
				label:
					owner.kind === CompanyBeneficialOwnerKind.PHYSICAL_PERSON
						? `Pièce d’identité de ${this.#beneficialOwnerLabel(owner)}`
						: `Extrait RNE ou équivalent Kbis de moins de trois mois de ${this.#beneficialOwnerLabel(owner)}`,
				ownerId: owner.id,
				step: SubscriptionStep.KYC,
				type:
					owner.kind === CompanyBeneficialOwnerKind.PHYSICAL_PERSON
						? SubscriptionDocumentType.BENEFICIAL_OWNER_ID
						: SubscriptionDocumentType.BENEFICIAL_OWNER_RNE,
			});
		}

		if (agreementTypes.includes(SubscriptionAgreement.PARTICIPATION)) {
			requirements.push({
				label: "Accord de participation ou DUE",
				ownerId: null,
				step: SubscriptionStep.CONTRACT_CHARACTERISTICS,
				type: SubscriptionDocumentType.PARTICIPATION_AGREEMENT,
			});
		}

		if (agreementTypes.includes(SubscriptionAgreement.INCENTIVES)) {
			requirements.push({
				label: "Accord d’intéressement ou DUE",
				ownerId: null,
				step: SubscriptionStep.CONTRACT_CHARACTERISTICS,
				type: SubscriptionDocumentType.INCENTIVES_AGREEMENT,
			});
		}

		if (agreementTypes.includes(SubscriptionAgreement.PPV)) {
			requirements.push({
				label: "Accord Prime de Partage de la Valeur (PPV) ou DUE",
				ownerId: null,
				step: SubscriptionStep.CONTRACT_CHARACTERISTICS,
				type: SubscriptionDocumentType.PPV_AGREEMENT,
			});
		}

		if (agreementTypes.includes(SubscriptionAgreement.PPVE)) {
			requirements.push({
				label: "Accord Plan de Partage de la Valorisation d’Entreprise (PPVE)",
				ownerId: null,
				step: SubscriptionStep.CONTRACT_CHARACTERISTICS,
				type: SubscriptionDocumentType.PPVE_AGREEMENT,
			});
		}

		if (agreementTypes.includes(SubscriptionAgreement.OTHER)) {
			requirements.push({
				label: "Autre accord (CET, etc.)",
				ownerId: null,
				step: SubscriptionStep.CONTRACT_CHARACTERISTICS,
				type: SubscriptionDocumentType.OTHER_AGREEMENT,
			});
		}

		return requirements.map((requirement) => ({
			...requirement,
			document:
				documentsByRequirement.get(this.#documentKey(requirement.type, requirement.ownerId)) ??
				null,
		}));
	}

	#beneficialOwnerLabel(owner: CompanyBeneficialOwner) {
		if (owner.kind === CompanyBeneficialOwnerKind.LEGAL_ENTITY) {
			return owner.legalName || `détenteur ${owner.id}`;
		}

		return [owner.firstName, owner.lastName].filter(Boolean).join(" ") || `détenteur ${owner.id}`;
	}

	#documentKey(type: SubscriptionDocumentTypeValue, ownerId: number | null) {
		return `${type}:${ownerId ?? "subscription"}`;
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
