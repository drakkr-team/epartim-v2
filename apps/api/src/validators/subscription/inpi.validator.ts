import vine from "@vinejs/vine";

import { INPI_COMPANY_FIELDS } from "#constants/inpi";

export const PreviewSubscriptionInpiSchema = vine.object({
	siren: vine
		.string()
		.trim()
		.regex(/^\d{9}$/),
});

export const ApplySubscriptionInpiSchema = vine.object({
	previewId: vine.string().uuid(),
	fields: vine
		.array(vine.enum(INPI_COMPANY_FIELDS))
		.distinct()
		.maxLength(INPI_COMPANY_FIELDS.length),
	legalAgentId: vine.string().uuid().nullable().optional(),
	ownerIds: vine.array(vine.string().uuid()).distinct().maxLength(100),
	confirmCompanyChange: vine.boolean().optional(),
});

export const ImportSubscriptionInpiArticlesSchema = vine.object({
	previewId: vine.string().uuid(),
	actId: vine.string().trim().minLength(1).maxLength(254),
	replaceExisting: vine.boolean().optional(),
});

export const PreviewSubscriptionInpiArticlesSchema = vine.object({
	params: vine.object({
		previewId: vine.string().uuid(),
		actId: vine.string().trim().minLength(1).maxLength(254),
	}),
});
