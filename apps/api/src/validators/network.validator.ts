import vine from "@vinejs/vine";

import { CreateAddressSchema } from "#validators/address.validator";
import { CreatePaymentDetailSchema } from "#validators/payment_detail.validator";

export const CreateNetworkSchema = vine.object({
	name: vine.string().trim().minLength(1).maxLength(254).unique({
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
	goCode: vine.number().withoutDecimals().nullable().optional(),
	address: CreateAddressSchema,
	paymentDetail: CreatePaymentDetailSchema,
});

export const UpdateNetworkSchema = CreateNetworkSchema.partial();
