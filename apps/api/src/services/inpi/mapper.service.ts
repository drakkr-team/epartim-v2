import { randomUUID } from "node:crypto";

import { DateTime } from "luxon";

import { CompanyBeneficialOwnerRoleCode } from "#constants/company_beneficial_owner_role";
import { CompanyLegalForm } from "#models/company";
import { ContactCivility, ContactFunction, ContactKind } from "#models/contact";
import { INPI_LEGAL_FORMS, INPI_ROLE_LABELS } from "#services/inpi/mappings";
import type { InpiAddress, InpiArticle, InpiCompany, InpiPerson } from "#services/inpi/types";

function object(value: unknown): Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: {};
}

function list(value: unknown): unknown[] {
	return Array.isArray(value) ? value : [];
}

function text(value: unknown, maxLength = 254) {
	const result = typeof value === "string" ? value.trim() : null;
	return result && result.length <= maxLength ? result : null;
}

function code(value: unknown) {
	return typeof value === "number" ? String(value) : text(value);
}

function matching(value: unknown, pattern: RegExp) {
	const result = text(value);
	return result && pattern.test(result) ? result : null;
}

const ROLE_FUNCTIONS: Record<string, ContactFunction> = {
	"28": ContactFunction.GERANT,
	"29": ContactFunction.GERANT,
	"30": ContactFunction.GERANT,
	"51": ContactFunction.PRESIDENT,
	"52": ContactFunction.PRESIDENT,
	"53": ContactFunction.DG,
	"60": ContactFunction.PDG,
	"69": ContactFunction.DG,
	"70": ContactFunction.DG,
	"73": ContactFunction.PRESIDENT,
	"101": ContactFunction.REPRESENTANT_LEGAL,
	"201": ContactFunction.REPRESENTANT_LEGAL,
	"205": ContactFunction.PRESIDENT,
	"206": ContactFunction.DG,
};

export default class InpiMapperService {
	company(payload: unknown, siren: string): InpiCompany {
		const root = object(payload);
		const formality = object(root.formality);
		const content = object(formality.content ?? root.content);
		const branch = object(
			content.personneMorale ?? content.personnePhysique ?? content.exploitation,
		);
		const identity = object(branch.identite);
		const enterprise = object(identity.entreprise);
		const entrepreneur = object(identity.entrepreneur);
		const person = object(entrepreneur.descriptionPersonne);
		const warnings: string[] = [];
		const establishments = [
			branch.etablissementPrincipal,
			...list(branch.autresEtablissements),
		].map(object);
		const headquarters = establishments.find((establishment) => {
			const description = object(establishment.descriptionEtablissement);
			return ["1", "2"].includes(code(description.rolePourEntreprise) ?? "");
		});
		const headquartersDescription = object(headquarters?.descriptionEtablissement);
		const nic = matching(enterprise.nicSiege, /^\d{5}$/);
		const siret =
			matching(headquartersDescription.siret, /^\d{14}$/) ?? (nic ? `${siren}${nic}` : null);
		const address = this.address(
			headquarters?.adresse ?? object(branch.adresseEntreprise).adresse,
			warnings,
		);
		const rawForm = code(
			enterprise.formeJuridique ?? object(content.natureCreation).formeJuridique,
		);
		const legalForm = rawForm ? (INPI_LEGAL_FORMS[rawForm] ?? null) : null;
		const activity = list(object(branch.etablissementPrincipal).activites)
			.map(object)
			.find((item) => item.indicateurPrincipal === true);
		const ape = text(activity?.codeApe ?? enterprise.codeApe ?? enterprise.codeAPE)
			?.replaceAll(".", "")
			.toUpperCase();
		const rawClosingDay = text(object(identity.description).dateClotureExerciceSocial);
		const closingDay = rawClosingDay?.replace(/^(\d{2})(\d{2})$/, "$1/$2") ?? null;
		const validClosingDay =
			closingDay &&
			/^\d{2}\/\d{2}$/.test(closingDay) &&
			DateTime.fromFormat(`${closingDay}/2000`, "dd/MM/yyyy").isValid
				? closingDay
				: null;
		const individualName = [
			list(person.prenoms)
				.map((value) => text(value))
				.filter(Boolean)
				.join(" "),
			text(person.nom),
		]
			.filter(Boolean)
			.join(" ");
		const result: InpiCompany = {
			siren,
			values: {
				name: text(enterprise.denomination) ?? text(individualName),
				siret: siret?.startsWith(siren) ? siret : null,
				naf: matching(ape, /^\d{4}[A-Z]$/),
				legalForm:
					legalForm ??
					(content.personnePhysique && !rawForm ? CompanyLegalForm.ENTREPRISE_INDIVIDUELLE : null),
				financialYearClosingDay: validClosingDay,
				addressLineOne: address.lineOne,
				addressLineTwo: address.lineTwo,
				addressZip: address.zip,
				addressCity: address.city,
			},
			people: this.#people(branch, warnings),
			warnings,
		};
		if (!Object.keys(branch).length) warnings.push("unsupported_company_type");
		if (!result.values.siret) warnings.push("headquarters_siret_missing");
		if (rawForm && legalForm === null) warnings.push("legal_form_unknown");
		if (rawClosingDay && !validClosingDay) warnings.push("closing_day_invalid");
		if (
			root.diffusionINSEE === "N" ||
			formality.diffusionINSEE === "N" ||
			enterprise.diffusionINSEE === "N"
		) {
			for (const field of Object.keys(result.values) as (keyof typeof result.values)[]) {
				result.values[field] = null;
			}
			result.people = [];
			warnings.push("restricted_diffusion");
		}
		result.warnings = [...new Set(warnings)];
		return result;
	}

	address(payload: unknown, warnings: string[]): InpiAddress {
		const address = object(payload);
		const country = code(address.codePays);
		const zip = matching(address.codePostal, /^\d{5}$/);
		if ((country && !["FR", "FRA", "99100"].includes(country)) || (address.codePostal && !zip)) {
			warnings.push("address_not_supported");
			return { lineOne: null, lineTwo: null, zip: null, city: null };
		}
		const street = [address.numVoie, address.indiceRepetition, address.typeVoie, address.voie]
			.map(code)
			.filter(Boolean)
			.join(" ");
		const extra = [address.distributionSpeciale, address.complementLocalisation]
			.map((value) => text(value))
			.filter(Boolean)
			.join(", ");
		if (street.length > 254 || extra.length > 254) warnings.push("address_not_supported");
		return { lineOne: text(street), lineTwo: text(extra), zip, city: text(address.commune) };
	}

	withdrawn(payload: unknown, id: string, siren: string) {
		const article = object(payload);
		return article.id === id && article.siren === siren && article.deleted === true;
	}

	articles(payload: unknown, siren: string) {
		return list(object(payload).actes)
			.map((value) => this.article(value, siren))
			.filter((value): value is InpiArticle => value !== null)
			.sort(
				(left, right) => right.date.localeCompare(left.date) || left.id.localeCompare(right.id),
			);
	}

	article(payload: unknown, siren: string): InpiArticle | null {
		const article = object(payload);
		if (article.deleted === true || article.siren !== siren) return null;
		if (article.confidentiality && article.confidentiality !== "Public") return null;
		if (!list(article.typeRdd).some((value) => object(value).typeActe === "Statuts mis à jour"))
			return null;
		const id = text(article.id);
		const date = matching(article.dateDepot, /^\d{4}-\d{2}-\d{2}$/);
		if (!id || !date || !DateTime.fromISO(date).isValid) return null;
		return { id, siren, date, name: text(article.nomDocument) ?? `statuts_${siren}.pdf` };
	}

	#people(branch: Record<string, unknown>, warnings: string[]) {
		const powers = list(object(branch.composition).pouvoirs).map(object);
		const entrepreneur = object(object(branch.identite).entrepreneur);
		if (Object.keys(object(entrepreneur.descriptionPersonne)).length) {
			powers.unshift({ individu: entrepreneur, roleEntreprise: "101" });
		}
		return powers.flatMap((power) => {
			const result: InpiPerson[] = [];
			const individual = object(power.individu);
			const representative = object(power.representant);
			const enterprise = object(power.entreprise);
			if (text(enterprise.denomination)) {
				result.push(this.#person(power, enterprise, power.adresseEntreprise, true, warnings));
			}
			if (text(object(individual.descriptionPersonne).nom)) {
				result.push(
					this.#person(
						power,
						object(individual.descriptionPersonne),
						individual.adresseDomicile,
						false,
						warnings,
					),
				);
			}
			if (text(object(representative.descriptionPersonne).nom)) {
				// A permanent representative is a separate candidate, never the legal entity itself.
				result.push(
					this.#person(
						{},
						object(representative.descriptionPersonne),
						representative.adresseDomicile,
						false,
						warnings,
					),
				);
			}
			return result;
		});
	}

	#person(
		power: Record<string, unknown>,
		description: Record<string, unknown>,
		address: unknown,
		moral: boolean,
		warnings: string[],
	): InpiPerson {
		const role = code(power.roleEntreprise) ?? "";
		const secondaryRole =
			power.indicateurSecondRoleEntreprise === true ? code(power.secondRoleEntreprise) : null;
		const roleCodes = [role, secondaryRole].filter((value): value is string => Boolean(value));
		const roles: CompanyBeneficialOwnerRoleCode[] = [];
		if (roleCodes.some((value) => ROLE_FUNCTIONS[value] !== undefined))
			roles.push(CompanyBeneficialOwnerRoleCode.DIRECTOR);
		if (power.beneficiaireEffectif === true)
			roles.push(CompanyBeneficialOwnerRoleCode.BENEFICIAL_OWNER);
		const rawBirthDate = text(description.dateDeNaissance);
		const birthDate = matching(rawBirthDate, /^\d{4}-\d{2}-\d{2}$/);
		const validBirthDate = birthDate && DateTime.fromISO(birthDate).isValid ? birthDate : null;
		if (rawBirthDate && !validBirthDate) warnings.push("partial_person_birth_date");
		const gender = code(description.genre);
		return {
			id: randomUUID(),
			kind: moral ? ContactKind.PERSONNE_MORALE : ContactKind.PERSONNE_PHYSIQUE,
			civility: moral
				? null
				: gender === "1"
					? ContactCivility.MONSIEUR
					: gender === "2"
						? ContactCivility.MADAME
						: null,
			firstName: moral
				? null
				: text(
						list(description.prenoms)
							.map((value) => text(value))
							.filter(Boolean)
							.join(" "),
						100,
					),
			lastName: moral ? null : text(description.nom, 100),
			legalName: moral ? text(description.denomination) : null,
			siren: moral ? matching(description.siren, /^\d{9}$/) : null,
			function: ROLE_FUNCTIONS[role] ?? null,
			functionLabel:
				roleCodes
					.map((value) => INPI_ROLE_LABELS[value])
					.filter(Boolean)
					.join(" / ") || null,
			roles,
			birthDate: moral ? null : validBirthDate,
			birthCity: moral ? null : text(description.lieuDeNaissance, 100),
			nationality: matching(description.nationalite, /^[A-Z]{2}$/),
			address: this.address(address, warnings),
		};
	}
}
