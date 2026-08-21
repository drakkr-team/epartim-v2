import vine from "@vinejs/vine";

export const AdminNameSchema = vine.string().trim().minLength(1).maxLength(255);

export const CreateAdminSchema = vine.object({
	name: AdminNameSchema,
	email: vine.string().trim().toLowerCase().email().maxLength(254),
});
