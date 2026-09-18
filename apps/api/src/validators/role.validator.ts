import vine from "@vinejs/vine";

import { AUTHORIZATIONS_OPTIONS } from "#models/role";

export const RoleNameSchema = vine.string().trim().minLength(1).maxLength(254);

export const CreateRoleSchema = vine.object({
	name: RoleNameSchema.unique({
		table: "roles",
		column: "name",
	}),
	authorizations: vine.array(vine.enum(AUTHORIZATIONS_OPTIONS)),
});

export const UpdateRoleSchema = CreateRoleSchema.partial();
