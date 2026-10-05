import vine, { ValidationError } from "@vinejs/vine";
import { DateTime } from "luxon";

import {
	SubscriptionCseFunction,
	SubscriptionFormalismGroup,
	SubscriptionFormalismMethod,
} from "#constants/subscription_formalism";

function optionalText(maxLength = 254) {
	return vine.string().trim().minLength(1).maxLength(maxLength).nullable().optional();
}
function optionalEmail() {
	return vine.string().trim().toLowerCase().email().maxLength(254).nullable().optional();
}
const calendarDate = vine.createRule((value, _, field) => {
	if (
		typeof value !== "string" ||
		!/^\d{4}-\d{2}-\d{2}$/.test(value) ||
		!DateTime.fromISO(value, { zone: "utc" }).isValid
	) {
		field.report("La date est invalide.", "date", field);
	}
});
const votes = () => vine.number().withoutDecimals().min(0).max(2147483647).nullable().optional();

export const UpdateFormalismPersonSchema = vine.object({
	firstName: optionalText(),
	lastName: optionalText(),
	email: optionalEmail(),
});
export const UpdateFormalismMemberSchema = vine.object({
	...UpdateFormalismPersonSchema.getProperties(),
	function: vine.enum(SubscriptionCseFunction).nullable().optional(),
	attending: vine.boolean().nullable().optional(),
});
const singleMandatedMember = vine.createRule((value, _, field) => {
	if (!Array.isArray(value)) return;
	if (value.filter((member) => member?.mandated === true).length > 1) {
		field.report("Un seul membre du CSE peut être mandaté.", "mandated", field);
	}
});

export const UpdateFormalismGroupSchema = vine.object({
	method: vine.enum(SubscriptionFormalismMethod).nullable().optional(),
	meetingDate: vine.string().trim().use(calendarDate()).nullable().optional(),
	meetingCity: optionalText(120),
	closingTime: vine
		.string()
		.regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/)
		.nullable()
		.optional(),
	votesFor: votes(),
	votesAgainst: votes(),
	votesAbstentions: votes(),
	presidentFirstName: optionalText(),
	presidentLastName: optionalText(),
	presidentEmail: optionalEmail(),
	mandatedMemberId: vine
		.number()
		.withoutDecimals()
		.positive()
		.max(2147483647)
		.nullable()
		.optional(),
	members: vine
		.array(
			vine.object({
				...UpdateFormalismMemberSchema.getProperties(),
				mandated: vine.boolean(),
			}),
		)
		.use(singleMandatedMember())
		.optional(),
});
export const ImportFormalismEmployeesSchema = vine.object({
	file: vine.file({ size: "10mb", extnames: ["csv"] }),
});
export const ImportedFormalismEmployeeSchema = vine.create(
	vine.object({
		firstName: vine.string().trim().minLength(1).maxLength(254),
		lastName: vine.string().trim().minLength(1).maxLength(254),
		email: vine.string().trim().toLowerCase().email().maxLength(254),
	}),
);

export function validateFormalismGroup(value: unknown): SubscriptionFormalismGroup {
	const group = Number(value);
	if (
		group !== SubscriptionFormalismGroup.PEI_PER &&
		group !== SubscriptionFormalismGroup.PARTICIPATION
	) {
		throw new ValidationError([
			{ field: "group", message: "Ce groupe de formalisme est invalide.", rule: "enum" },
		]);
	}
	return group;
}
export function validateFormalismPersonId(value: unknown) {
	const id = Number(value);
	if (!Number.isInteger(id) || id <= 0 || id > 2147483647) {
		throw new ValidationError([
			{ field: "id", message: "Cet identifiant est invalide.", rule: "number" },
		]);
	}
	return id;
}
