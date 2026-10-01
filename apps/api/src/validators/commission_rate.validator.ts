import vine from "@vinejs/vine";

export const CreateCommissionRateSchema = vine.object({
	shortTermRatePercent: vine.number().min(0).max(100),
	mediumTermRatePercent: vine.number().min(0).max(100),
	longTermRatePercent: vine.number().min(0).max(100),
});

export const UpdateCommissionRateSchema = CreateCommissionRateSchema.partial();
