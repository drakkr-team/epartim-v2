import vine from "@vinejs/vine";
import { isPossiblePhoneNumber } from "libphonenumber-js/min";

import {
	ContactAuthorization,
	ContactCivility,
	ContactFunction,
	ContactKind,
} from "#models/contact";

const ContactCivilities = Object.values(ContactCivility);
const ContactFunctions = Object.values(ContactFunction);
const ContactKinds = Object.values(ContactKind);
const ContactAuthorizations = Object.values(ContactAuthorization);

const possiblePhoneNumber = vine.createRule(
	(value, _, field) => {
		if (!isPossiblePhoneNumber(String(value))) {
			field.report("The {{ field }} must be a complete phone number", "phoneNumber", field);
		}
	},
	{ name: "possiblePhoneNumber" },
);

function optionalText() {
	return vine.string().trim().minLength(1).maxLength(254).nullable().optional();
}

function optionalEmail() {
	return vine.string().trim().toLowerCase().email().maxLength(254).nullable().optional();
}

function optionalPhoneNumber() {
	return vine.string().trim().use(possiblePhoneNumber()).nullable().optional();
}

function requiredPhoneNumber() {
	return vine
		.string()
		.trim()
		.regex(/^\+[1-9]\d{6,14}$/);
}

export const ContactSchema = vine.object({
	civility: vine.enum(ContactCivilities).nullable().optional(),
	firstName: optionalText(),
	lastName: optionalText(),
	function: vine.enum(ContactFunctions).nullable().optional(),
	email: optionalEmail(),
	phoneNumber: optionalPhoneNumber(),
	amundiPortalId: optionalText(),
});

export const LegalAgentSchema = vine.object({
	kind: vine.enum(ContactKinds).nullable().optional(),
	civility: vine.enum(ContactCivilities).nullable().optional(),
	firstName: optionalText(),
	lastName: optionalText(),
	legalName: optionalText(),
	function: vine.enum(ContactFunctions).nullable().optional(),
	email: optionalEmail(),
	phoneNumber: optionalPhoneNumber(),
});

export const SignerSchema = vine.object({
	...ContactSchema.getProperties(),
	isSignatoryOnKbis: vine.boolean().nullable().optional(),
});

export const CorrespondentSchema = vine.object({
	...ContactSchema.getProperties(),
	isSameAsLegal: vine.boolean().nullable().optional(),
});

export const AuthorizationSchema = vine.object({
	...ContactSchema.getProperties(),
	phoneNumber: requiredPhoneNumber(),
	authorizations: vine.array(vine.enum(ContactAuthorizations)).distinct().nullable().optional(),
});
