import vine from "@vinejs/vine";

import { CreateAddressSchema, UpdateAddressSchema } from "#validators/address.validator";
import {
	CreateCommissionRateSchema,
	UpdateCommissionRateSchema,
} from "#validators/commission_rate.validator";
import {
	CreatePaymentDetailSchema,
	UpdatePaymentDetailSchema,
} from "#validators/payment_detail.validator";

export const CreateNetworkSchema = vine.object({
	name: vine.string().trim().minLength(1).maxLength(254).unique({
		table: "networks",
		column: "name",
	}),
	address: CreateAddressSchema,
	paymentDetail: CreatePaymentDetailSchema,
	commissionRate: CreateCommissionRateSchema,
});

export const UpdateNetworkSchema = vine
	.object({
		...CreateNetworkSchema.omit(["address", "commissionRate", "paymentDetail"]),
		address: UpdateAddressSchema,
		paymentDetail: UpdatePaymentDetailSchema,
		commissionRate: UpdateCommissionRateSchema,
	})
	.partial();
