import vine from "@vinejs/vine";

import { AuthorizationSchema } from "#validators/subscription/representatives/contact.validator";

const distinctDefinedEmails = vine.createRule((value, _, field) => {
	if (!Array.isArray(value)) return;

	const emails = value.flatMap((authorization) => {
		if (typeof authorization !== "object" || authorization === null) return [];
		const { email } = authorization;

		return typeof email === "string" ? [email] : [];
	});

	if (new Set(emails).size !== emails.length) {
		field.report("The {{ field }} field has duplicate values", "distinct", field);
	}
});

export const UpdateAuthorizationsSchema = vine.object({
	authorizations: vine.array(AuthorizationSchema).use(distinctDefinedEmails()),
});
