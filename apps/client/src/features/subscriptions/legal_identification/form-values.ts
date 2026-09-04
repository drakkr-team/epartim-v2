export const LEGAL_FORMS = [
	1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
] as const;

export type LegalForm = (typeof LEGAL_FORMS)[number];

export type LegalIdentificationFormValues = {
	siren: string;
	siret: string;
	naf: string;
	name: string;
	legalForm: LegalForm | null;
	companyHeadcount: number | null;
	vatNumber: string;
	financialYearClosingDay: string;
};

export type LegalIdentificationFieldName = keyof LegalIdentificationFormValues;

export type LegalIdentificationPatch = {
	siren?: string;
	siret?: string | null;
	naf?: string;
	name?: string;
	legalForm?: LegalForm;
	companyHeadcount?: number;
	vatNumber?: string | null;
	financialYearClosingDay?: string;
};

type LegalIdentificationResponse = Partial<{
	siren: string | null;
	siret: string | null;
	naf: string | null;
	name: string | null;
	legalForm: number | null;
	companyHeadcount: string | null;
	vatNumber: string | null;
	financialYearClosingDay: string | null;
}>;

export function getLegalIdentificationFormValues(
	legalIdentification: LegalIdentificationResponse | null | undefined,
): LegalIdentificationFormValues {
	const companyHeadcount = Number(legalIdentification?.companyHeadcount);
	const legalForm = legalIdentification?.legalForm;

	return {
		siren: legalIdentification?.siren ?? "",
		siret: legalIdentification?.siret ?? "",
		naf: legalIdentification?.naf ?? "",
		name: legalIdentification?.name ?? "",
		legalForm: LEGAL_FORMS.includes(legalForm as LegalForm) ? (legalForm as LegalForm) : null,
		companyHeadcount:
			Number.isInteger(companyHeadcount) && companyHeadcount > 0 ? companyHeadcount : null,
		vatNumber: legalIdentification?.vatNumber ?? "",
		financialYearClosingDay: legalIdentification?.financialYearClosingDay ?? "",
	};
}

export function getLegalIdentificationPatch(
	name: LegalIdentificationFieldName,
	value: LegalIdentificationFormValues[LegalIdentificationFieldName],
): LegalIdentificationPatch | null {
	if (value === null) return null;

	return {
		[name]: name === "siret" || name === "vatNumber" ? (value === "" ? null : value) : value,
	} as LegalIdentificationPatch;
}
