import vine from "@vinejs/vine";

export const AdminNameSchema = vine.string().trim().minLength(1).maxLength(255);

export const CreateAdminSchema = vine.object({
	name: AdminNameSchema,
	email: vine.string().trim().toLowerCase().email().maxLength(254),
});

export const AdminSortOptions = [
	"id_asc",
	"id_desc",
	"name_asc",
	"name_desc",
	"email_asc",
	"email_desc",
	"activatedAt_asc",
	"activatedAt_desc",
	"createdAt_asc",
	"createdAt_desc",
	"updatedAt_asc",
	"updatedAt_desc",
] as const;

export const ListAdminsSchema = vine.object({
	page: vine.number().min(1).optional(),
	perPage: vine.number().min(1).optional(),
	search: vine.string().trim().optional(),
	sortBy: vine.enum(AdminSortOptions).optional(),
});

export const UpdateAdminSchema = vine.object({
	name: AdminNameSchema,
});
