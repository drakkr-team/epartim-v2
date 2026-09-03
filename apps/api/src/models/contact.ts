import { column } from "@adonisjs/lucid/orm";

import { ContactSchema } from "#database/schema";

export const ContactFunction = {
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

export type ContactFunction = (typeof ContactFunction)[keyof typeof ContactFunction];

export const ContactKind = {
	PERSONNE_PHYSIQUE: 1,
	PERSONNE_MORALE: 2,
} as const;

export type ContactKind = (typeof ContactKind)[keyof typeof ContactKind];

export const ContactAuthorization = {
	COMPTABLE: 1,
	AGIR_ET_CONSULTER: 2,
	ADMINISTRER: 3,
} as const;

export type ContactAuthorization = (typeof ContactAuthorization)[keyof typeof ContactAuthorization];

export default class Contact extends ContactSchema {
	declare kind: ContactKind | null;

	@column()
	declare legalName: string | null;

	@column({
		prepare: (authorizations: ContactAuthorization[] | null) =>
			authorizations === null ? null : JSON.stringify(authorizations),
		consume: (authorizations: ContactAuthorization[] | null) => authorizations,
	})
	declare authorizations: ContactAuthorization[] | null;
}
