import vine from "@vinejs/vine";

import { CreateAddressSchema } from "#validators/address.validator";
import { CreatePaymentDetailSchema } from "#validators/payment_detail.validator";

export const CreateNetworkSchema = vine.object({
	name: vine.string().trim().minLength(1).maxLength(254).unique({
		table: "networks",
		column: "name",
	}),
	address: CreateAddressSchema,
	paymentDetail: CreatePaymentDetailSchema,
});

export const UpdateNetworkSchema = CreateNetworkSchema.partial();
