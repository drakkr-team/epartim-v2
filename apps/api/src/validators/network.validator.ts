import vine from "@vinejs/vine";

import { CreateAddressSchema } from "#validators/address.validator";
import { CreateCommissionRateSchema } from "#validators/commission_rate.validator";
import { CreatePaymentDetailSchema } from "#validators/payment_detail.validator";

export const CreateNetworkSchema = vine.object({
	name: vine.string().trim().minLength(1).maxLength(254).unique({
		table: "networks",
		column: "name",
	}),
	address: CreateAddressSchema,
	paymentDetail: CreatePaymentDetailSchema,
	commissionRate: CreateCommissionRateSchema,
});

export const UpdateNetworkSchema = CreateNetworkSchema.partial();
