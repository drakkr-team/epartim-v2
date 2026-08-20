import vine from "@vinejs/vine";

import { ROLE_CODES } from "#models/role";

const adminUserInputProperties = {
	firstName: vine.string().trim().minLength(2).maxLength(254),
	lastName: vine.string().trim().minLength(2).maxLength(254),
	mobilePhone: vine.string().trim().maxLength(32).nullable().optional(),
	roleCode: vine.enum(ROLE_CODES),
	firmId: vine.number().positive().nullable().optional(),
	networkId: vine.number().positive().nullable().optional(),
};

export const AdminUserInputSchema = vine.object(adminUserInputProperties);

export const CreateAdminUserSchema = vine.object({
	email: vine.string().trim().toLowerCase().email(),
	...adminUserInputProperties,
});
