import type { CompanyBeneficialOwnerRoleCode } from "#constants/company_beneficial_owner_role";
import type { InpiCompanyField } from "#constants/inpi";
import type { ContactCivility, ContactFunction, ContactKind } from "#models/contact";

export type InpiCompanyValues = Record<InpiCompanyField, string | number | null>;

export type InpiAddress = {
	lineOne: string | null;
	lineTwo: string | null;
	zip: string | null;
	city: string | null;
};

export type InpiPerson = {
	id: string;
	kind: ContactKind;
	civility: ContactCivility | null;
	firstName: string | null;
	lastName: string | null;
	legalName: string | null;
	siren: string | null;
	function: ContactFunction | null;
	functionLabel: string | null;
	roles: CompanyBeneficialOwnerRoleCode[];
	birthDate: string | null;
	birthCity: string | null;
	nationality: string | null;
	address: InpiAddress;
};

export type InpiArticle = {
	id: string;
	siren: string;
	date: string;
	name: string;
};

export type InpiCompany = {
	siren: string;
	values: InpiCompanyValues;
	people: InpiPerson[];
	warnings: string[];
};
