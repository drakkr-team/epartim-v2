import vine from "@vinejs/vine";

export const AdminNameSchema = vine.string().trim().minLength(1).maxLength(254);

export const CreateAdminSchema = vine.object({
	name: AdminNameSchema,
	email: vine.string().trim().email().maxLength(254).unique({
		table: "admins",
		column: "email",
	}),
});

export const UpdateAdminSchema = vine.object({
	name: AdminNameSchema,
});
