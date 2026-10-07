export const INPI_COMPANY_FIELDS = [
	"name",
	"siret",
	"naf",
	"legalForm",
	"financialYearClosingDay",
	"addressLineOne",
	"addressLineTwo",
	"addressZip",
	"addressCity",
] as const;

export type InpiCompanyField = (typeof INPI_COMPANY_FIELDS)[number];
