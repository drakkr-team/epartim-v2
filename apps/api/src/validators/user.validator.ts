import vine from "@vinejs/vine";

export const UserPasswordValidator = vine.string().minLength(8).maxLength(32);

export const UserNameSchema = vine.string().trim().minLength(2).maxLength(254);

export const CreateUserSchema = vine.object({
	firstName: UserNameSchema,
	lastName: UserNameSchema,
	email: vine.string().trim().toLowerCase().email().maxLength(254),
});

export const UserSortOptions = [
	"id_asc",
	"id_desc",
	"firstName_asc",
	"firstName_desc",
	"lastName_asc",
	"lastName_desc",
	"email_asc",
	"email_desc",
	"createdAt_asc",
	"createdAt_desc",
	"updatedAt_asc",
	"updatedAt_desc",
] as const;

export const ListUsersSchema = vine.object({
	page: vine.number().min(1).optional(),
	perPage: vine.number().min(1).optional(),
	search: vine.string().trim().optional(),
	sortBy: vine.enum(UserSortOptions).optional(),
});

export const UpdateManagedUserSchema = vine.object({
	firstName: UserNameSchema,
	lastName: UserNameSchema,
});

export const UpdateUserSchema = vine.object({
	firstName: vine.string().minLength(2).maxLength(254).optional(),
	lastName: vine.string().minLength(2).maxLength(254).optional(),
});
