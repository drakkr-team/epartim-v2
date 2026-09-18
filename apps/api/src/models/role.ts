import { column, hasMany } from "@adonisjs/lucid/orm";
import type { HasMany } from "@adonisjs/lucid/types/relations";

import { RoleSchema } from "#database/schema";
import Admin from "#models/admin";

const AUTHORIZATIONS_RESOURCES = ["admin", "role", "user", "firm", "network"] as const;
const AUTHORIZATIONS_ACTIONS = ["create", "update", "delete"] as const;

type AuthorizationResources = (typeof AUTHORIZATIONS_RESOURCES)[number];
type AuthorizationActions = (typeof AUTHORIZATIONS_ACTIONS)[number];

export type AuthorizationOption = `${AuthorizationActions}:${AuthorizationResources}`;
export const AUTHORIZATIONS_OPTIONS: AuthorizationOption[] = AUTHORIZATIONS_ACTIONS.flatMap(
	(action) =>
		AUTHORIZATIONS_RESOURCES.map((resource) => `${action}:${resource}` as AuthorizationOption),
);

export default class Role extends RoleSchema {
	@column({
		prepare: (value) => (typeof value === "object" ? JSON.stringify(value) : value),
		consume: (value) => (typeof value === "string" ? JSON.parse(value) : value),
	})
	declare authorizations: AuthorizationOption[];

	@hasMany(() => Admin)
	declare admins: HasMany<typeof Admin>;
}
