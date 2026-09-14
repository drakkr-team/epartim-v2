import vine from "@vinejs/vine";

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

function optionalText() {
	return vine.string().trim().minLength(1).maxLength(254).nullable().optional();
}

function optionalEmail() {
	return vine.string().trim().toLowerCase().email().maxLength(254).nullable().optional();
}

function optionalPhoneNumber() {
	return vine
		.string()
		.trim()
		.regex(/^\+[1-9]\d{6,14}$/)
		.nullable()
		.optional();
}

const PersonSchema = vine.object({
	civility: vine.enum(ContactCivilities).nullable().optional(),
	firstName: optionalText(),
	lastName: optionalText(),
	function: vine.enum(ContactFunctions).nullable().optional(),
	email: optionalEmail(),
	phoneNumber: optionalPhoneNumber(),
	amundiPortalId: optionalText(),
});

const LegalAgentSchema = vine.object({
	kind: vine.enum(ContactKinds).nullable().optional(),
	civility: vine.enum(ContactCivilities).nullable().optional(),
	firstName: optionalText(),
	lastName: optionalText(),
	legalName: optionalText(),
	function: vine.enum(ContactFunctions).nullable().optional(),
	email: optionalEmail(),
	phoneNumber: optionalPhoneNumber(),
});

const SignerSchema = vine.object({
	...PersonSchema.getProperties(),
	isSignatoryOnKbis: vine.boolean().nullable().optional(),
});

const CorrespondentSchema = vine.object({
	...PersonSchema.getProperties(),
	isSameAsLegal: vine.boolean().nullable().optional(),
});

const AuthorizationSchema = vine.object({
	...PersonSchema.getProperties(),
	authorizations: vine.array(vine.enum(ContactAuthorizations)).distinct().nullable().optional(),
});

export const UpdateRepresentativesAndAuthorizationsSchema = vine.object({
	legalAgent: LegalAgentSchema.nullable().optional(),
	signer: SignerSchema.nullable().optional(),
	correspondent: CorrespondentSchema.nullable().optional(),
	authorizations: vine.array(AuthorizationSchema).distinct("email").optional(),
});
