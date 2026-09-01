import vine from "@vinejs/vine";

export const CreatePaymentDetailSchema = vine.object({
	iban: vine.string().trim().toUpperCase().iban(),
	bic: vine.string().trim().toUpperCase().minLength(8).maxLength(11),
});

export const UpdatePaymentDetailSchema = CreatePaymentDetailSchema.partial();
