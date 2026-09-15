import vine from "@vinejs/vine";

import { AuthorizationSchema } from "#validators/subscription/representatives/contact.validator";

export const UpdateAuthorizationsSchema = vine.object({
	authorizations: vine.array(AuthorizationSchema).distinct("email"),
});
