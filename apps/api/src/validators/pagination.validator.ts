import vine from "@vinejs/vine";

export const PaginationValidator = vine.object({
	page: vine.number().positive().withoutDecimals().optional(),
	perPage: vine.number().positive().withoutDecimals().optional(),
});
