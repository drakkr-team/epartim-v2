import { z } from "zod";

export const ADMIN_ORDER_OPTIONS = [
	"createdAt_desc",
	"createdAt_asc",
	"name_asc",
	"name_desc",
	"email_asc",
	"email_desc",
	"activatedAt_asc",
	"activatedAt_desc",
	"updatedAt_asc",
	"updatedAt_desc",
] as const;

export const ADMIN_LIST_DEFAULTS = {
	page: 1,
	perPage: 20,
	orderBy: "createdAt_desc",
} as const;

const positiveIntegerWithDefault = (fallback: number) =>
	z.coerce.number().int().positive().catch(fallback);

export const adminListSearchSchema = z.object({
	page: positiveIntegerWithDefault(ADMIN_LIST_DEFAULTS.page),
	perPage: positiveIntegerWithDefault(ADMIN_LIST_DEFAULTS.perPage),
	q: z
		.string()
		.trim()
		.max(254)
		.optional()
		.transform((value) => value || undefined),
	orderBy: z.enum(ADMIN_ORDER_OPTIONS).catch(ADMIN_LIST_DEFAULTS.orderBy),
});

export type AdminListSearch = z.infer<typeof adminListSearchSchema>;

export type Admin = {
	readonly id: number;
	readonly name: string;
	readonly email: string;
	readonly activatedAt: Date | null;
	readonly createdAt: Date;
	readonly updatedAt: Date;
};

export type AdminPermissions = {
	readonly canUpdate: boolean;
	readonly canDelete: boolean;
};

export type AdminWithPermissions = Admin & {
	readonly meta: AdminPermissions;
};

export type AdminFieldErrors = {
	readonly name?: string;
	readonly email?: string;
};

export const adminCreateSchema = z.object({
	name: z.string().trim().min(1).max(255),
	email: z.string().trim().email().max(254),
});

export const adminUpdateSchema = z.object({
	name: z.string().trim().min(1).max(255),
});

export function isUnchangedAdminName(nextName: string, currentName: string) {
	return nextName.trim() === currentName;
}

export function formatAdminDate(value: Date) {
	return new Intl.DateTimeFormat("fr-FR", {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(value);
}
