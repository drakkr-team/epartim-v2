import vine from "@vinejs/vine";

import { CreateAddressSchema } from "#validators/address.validator";
import { CreatePaymentDetailSchema } from "#validators/payment_detail.validator";

export const CreateFirmSchema = vine.object({
	name: vine.string().trim().minLength(1).maxLength(254).unique({
		table: "firms",
		column: "name",
	}),
	// amundiOrgId: vine
	// 	.string()
	// 	.trim()
	// 	.minLength(1)
	// 	.maxLength(254)
	// 	.unique({
	// 		table: "firms",
	// 		column: "amundi_org_id",
	// 	})
	// 	.nullable()
	// 	.optional(),
	orias: vine.string().trim().minLength(1).maxLength(254).unique({
		table: "firms",
		column: "orias",
	}),
	networkId: vine.number().exists({ table: "networks", column: "id" }).nullable().optional(),
	address: CreateAddressSchema,
	paymentDetail: CreatePaymentDetailSchema,
});

export const UpdateFirmSchema = CreateFirmSchema.partial();
