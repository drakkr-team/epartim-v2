import vine from "@vinejs/vine";

import { CreateAddressSchema } from "#validators/address.validator";
import { CreateCommissionRateSchema } from "#validators/commission_rate.validator";
import { CreatePaymentDetailSchema } from "#validators/payment_detail.validator";

export const CreateFirmSchema = vine.object({
	name: vine.string().trim().minLength(1).maxLength(254).unique({
		table: "firms",
		column: "name",
	}),
	orias: vine.string().trim().minLength(1).maxLength(254).unique({
		table: "firms",
		column: "orias",
	}),
	networkId: vine.number().exists({ table: "networks", column: "id" }).nullable().optional(),
	address: CreateAddressSchema,
	paymentDetail: CreatePaymentDetailSchema,
	commissionRate: CreateCommissionRateSchema,
});

export const UpdateFirmSchema = CreateFirmSchema.partial();
