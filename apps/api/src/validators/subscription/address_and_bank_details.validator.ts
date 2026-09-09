import vine from "@vinejs/vine";

const AddressSchema = vine.object({
	lineOne: vine.string().trim().minLength(1).maxLength(254).nullable(),
	lineTwo: vine.string().trim().minLength(1).maxLength(254).nullable(),
	zip: vine
		.string()
		.trim()
		.regex(/^\d{5}$/)
		.nullable(),
	city: vine.string().trim().minLength(1).maxLength(254).nullable(),
});

const PaymentDetailSchema = vine.object({
	iban: vine.string().trim().toUpperCase().iban().nullable(),
	bic: vine
		.string()
		.trim()
		.toUpperCase()
		.regex(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/)
		.nullable(),
});

export const UpdateAddressAndBankDetailsSchema = vine.object({
	address: AddressSchema.partial().optional(),
	paymentDetail: PaymentDetailSchema.partial().optional(),
});
