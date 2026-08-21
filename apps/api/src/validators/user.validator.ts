import vine from "@vinejs/vine";

export const UserPasswordValidator = vine.string().minLength(8).maxLength(32);

export const UserNameSchema = vine.string().trim().minLength(2).maxLength(254);

export const CreateUserSchema = vine.object({
	firstName: UserNameSchema,
	lastName: UserNameSchema,
	email: vine.string().trim().toLowerCase().email().maxLength(254).unique({
		table: "users",
		column: "email",
	}),
});

export const UpdateAdminUserSchema = vine.object({
	firstName: UserNameSchema,
	lastName: UserNameSchema,
});

export const UpdateUserSchema = vine.object({
	firstName: UserNameSchema.optional(),
	lastName: UserNameSchema.optional(),
});
