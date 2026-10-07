import vine from "@vinejs/vine";

export const PreviewSubscriptionInpiSchema = vine.object({
	siren: vine
		.string()
		.trim()
		.regex(/^\d{9}$/),
});

export const PreviewSubscriptionInpiArticlesSchema = vine.object({
	params: vine.object({
		previewId: vine.string().uuid(),
		actId: vine.string().trim().minLength(1).maxLength(254),
	}),
});
