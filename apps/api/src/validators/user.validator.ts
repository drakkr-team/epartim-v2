import vine from "@vinejs/vine";

export const UserPasswordValidator = vine.string().minLength(8).maxLength(32);

export const UpdateUserSchema = vine.object({
	firstName: vine.string().minLength(2).maxLength(254).optional(),
	lastName: vine.string().minLength(2).maxLength(254).optional(),
});
