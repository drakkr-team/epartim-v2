import vine from "@vinejs/vine";

export const CreateAddressSchema = vine.object({
	lineOne: vine.string().trim().minLength(1).maxLength(254),
	lineTwo: vine.string().trim().minLength(1).maxLength(254).nullable().optional(),
	zip: vine.string().trim().postalCode(),
	city: vine.string().trim().minLength(1).maxLength(254),
	coordinates: vine.object({
		latitude: vine.number().min(-90).max(90),
		longitude: vine.number().min(-180).max(180),
	}),
});

export const UpdateAddressSchema = CreateAddressSchema.partial();
