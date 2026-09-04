import vine from "@vinejs/vine";

import { CompanyLegalForm } from "#models/company";

const LegalForms = Object.values(CompanyLegalForm);

function requiredText() {
	return vine.string().trim().minLength(1).maxLength(254);
}

const LegalIdentificationSchema = vine.object({
	siren: requiredText().regex(/^\d{9}$/),
	siret: vine
		.string()
		.trim()
		.regex(/^\d{14}$/)
		.nullable(),
	naf: requiredText().regex(/^\d{4}[A-Z]$/),
	name: requiredText(),
	legalForm: vine.enum(LegalForms),
	companyHeadcount: vine.number().withoutDecimals().min(1),
	vatNumber: vine
		.string()
		.trim()
		.regex(/^FR\d{2}\d{9}$/)
		.nullable(),
	financialYearClosingDay: requiredText().regex(/^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])$/),
});

export const UpdateSubscriptionLegalIdentificationSchema = vine.object({
	legalIdentification: LegalIdentificationSchema.partial(),
});
