export const CONTACT_FUNCTIONS = {
	PDG: 1,
	GERANT: 2,
	DG: 3,
	DF: 4,
	DAF: 5,
	RESPONSABLE_COMPTABLE: 6,
	DRH: 7,
	RH: 8,
	ASSISTANTE: 9,
	CORRESPONDANT_OPERATIONNEL_ES: 10,
	PRESIDENT: 11,
	REPRESENTANT_LEGAL: 12,
	AUTRE: 13,
} as const;
export type ContactFunction = (typeof CONTACT_FUNCTIONS)[keyof typeof CONTACT_FUNCTIONS];

export const CONTACT_KINDS = {
	PERSONNE_PHYSIQUE: 1,
	PERSONNE_MORALE: 2,
} as const;
export type ContactKind = (typeof CONTACT_KINDS)[keyof typeof CONTACT_KINDS];

export const CONTACT_CIVILITIES = {
	MONSIEUR: 1,
	MADAME: 2,
} as const;
export type ContactCivility = (typeof CONTACT_CIVILITIES)[keyof typeof CONTACT_CIVILITIES];

export const CONTACT_AUTHORIZATIONS = {
	COMPTABLE: 1,
	AGIR_ET_CONSULTER: 2,
	ADMINISTRER: 3,
} as const;
export type ContactAuthorization =
	(typeof CONTACT_AUTHORIZATIONS)[keyof typeof CONTACT_AUTHORIZATIONS];
