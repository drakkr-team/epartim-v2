import vine from "@vinejs/vine";

import { CreateAddressSchema, UpdateAddressSchema } from "#validators/address.validator";

const normalizeBankCode = (value: unknown) =>
	typeof value === "string" ? value.replace(/\s/g, "").toUpperCase() : value;

const hasUpdate = vine.createRule((value, _, field) => {
	if (typeof value !== "object" || value === null || Array.isArray(value)) {
		return;
	}

	const input: unknown = field.data;
	if (typeof input === "object" && input !== null) {
		for (const key of ["name", "orias"]) {
			if (!Object.hasOwn(input, key)) {
				continue;
			}

			const fieldValue = Reflect.get(input, key);
			if (typeof fieldValue !== "string" || fieldValue.trim().length === 0) {
				field.report(`The ${key} field must not be empty`, "minLength", field);
				return;
			}
		}
	}

	const hasFirmField = ["name", "amundiOrgId", "orias", "networkId"].some((key) =>
		Object.hasOwn(value, key),
	);
	const hasNestedField = ["address", "paymentDetails"].some((key) => {
		const nested = Reflect.get(value, key);
		return typeof nested === "object" && nested !== null && Object.keys(nested).length > 0;
	});

	if (!hasFirmField && !hasNestedField) {
		field.report("The request must update at least one field", "hasUpdate", field);
	}
});

const UpdatePaymentDetailsSchema = vine.object({
	iban: vine.string().parse(normalizeBankCode).iban().optional(),
	bic: vine
		.string()
		.parse(normalizeBankCode)
		.regex(/^[A-Z]{6}[A-Z0-9]{2}(?:[A-Z0-9]{3})?$/)
		.optional(),
});

const CreatePaymentDetailsSchema = vine.object({
	iban: vine.string().parse(normalizeBankCode).iban(),
	bic: vine
		.string()
		.parse(normalizeBankCode)
		.regex(/^[A-Z]{6}[A-Z0-9]{2}(?:[A-Z0-9]{3})?$/),
});

export const CreateFirmSchema = vine.object({
	name: vine.string().trim().minLength(1).maxLength(254).unique({
		table: "firms",
		column: "name",
	}),
	amundiOrgId: vine
		.string()
		.trim()
		.minLength(1)
		.maxLength(254)
		.unique({
			table: "firms",
			column: "amundi_org_id",
		})
		.nullable()
		.optional(),
	orias: vine.string().trim().minLength(1).maxLength(254).unique({
		table: "firms",
		column: "orias",
	}),
	networkId: vine
		.number()
		.positive()
		.withoutDecimals()
		.exists({ table: "networks", column: "id" })
		.nullable()
		.optional(),
	address: CreateAddressSchema,
	paymentDetails: CreatePaymentDetailsSchema,
});

export const UpdateFirmSchema = vine
	.object({
		name: vine
			.string()
			.trim()
			.minLength(1)
			.maxLength(254)
			.unique({
				table: "firms",
				column: "name",
				filter: (query, _, field) => {
					query.whereNot("id", Number(field.meta.firmId));
				},
			})
			.optional(),
		amundiOrgId: vine
			.string()
			.trim()
			.minLength(1)
			.maxLength(254)
			.unique({
				table: "firms",
				column: "amundi_org_id",
				filter: (query, _, field) => {
					query.whereNot("id", Number(field.meta.firmId));
				},
			})
			.nullable()
			.optional(),
		orias: vine
			.string()
			.trim()
			.minLength(1)
			.maxLength(254)
			.unique({
				table: "firms",
				column: "orias",
				filter: (query, _, field) => {
					query.whereNot("id", Number(field.meta.firmId));
				},
			})
			.optional(),
		networkId: vine
			.number()
			.positive()
			.withoutDecimals()
			.exists({ table: "networks", column: "id" })
			.nullable()
			.optional(),
		address: UpdateAddressSchema.optional(),
		paymentDetails: UpdatePaymentDetailsSchema.optional(),
	})
	.use(hasUpdate());
