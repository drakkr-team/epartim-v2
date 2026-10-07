import vine from "@vinejs/vine";

import { USER_ROLES } from "#constants/user";

export const UserPasswordValidator = vine.string().minLength(8).maxLength(32);

export const CreateUserSchema = vine.object({
	firstName: vine.string().trim().minLength(2).maxLength(254),
	lastName: vine.string().trim().minLength(2).maxLength(254),
	email: vine.string().email().maxLength(254).unique({
		table: "users",
		column: "email",
	}),
	role: vine.enum(USER_ROLES),
	firmId: vine.number().exists({ table: "firms", column: "id" }),
});

export const UpdateUserSchema = vine.object({
	...CreateUserSchema.partial().omit(["email", "firmId"]),
	firmId: vine
		.number()
		.exists({ table: "firms", column: "id" })
		.optional()
		.requiredWhen((field) => field.value !== undefined),
});
