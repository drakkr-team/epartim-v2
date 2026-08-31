import vine from "@vinejs/vine";

const NetworkNameSchema = vine.string().trim().minLength(1).maxLength(254);
const NullableIntegerSchema = vine.number().withoutDecimals().nullable().optional();

const AddressSchema = vine.object({
	lineOne: vine.string().trim().minLength(1).maxLength(254),
	lineTwo: vine.string().trim().minLength(1).maxLength(254).nullable().optional(),
	zip: vine.string().trim().minLength(1).maxLength(254),
	city: vine.string().trim().minLength(1).maxLength(254),
	coordinates: vine
		.object({
			latitude: vine.number().min(-90).max(90),
			longitude: vine.number().min(-180).max(180),
		})
		.nullable()
		.optional(),
});

const PaymentDetailsSchema = vine.object({
	iban: vine.string().trim().minLength(1).maxLength(254),
	bic: vine.string().trim().minLength(1).maxLength(254),
});

export const CreateNetworkSchema = vine.object({
	name: NetworkNameSchema.unique({
		table: "networks",
		column: "name",
	}),
	amundiOrgId: vine
		.string()
		.trim()
		.minLength(1)
		.maxLength(254)
		.unique({
			table: "networks",
			column: "amundi_org_id",
		})
		.nullable()
		.optional(),
	goCode: NullableIntegerSchema,
	address: AddressSchema,
	paymentDetails: PaymentDetailsSchema,
});
