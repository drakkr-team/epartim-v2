import { column, hasMany } from "@adonisjs/lucid/orm";
import type { HasMany } from "@adonisjs/lucid/types/relations";

import type { AuthorizationOption } from "#constants/role";
import { RoleSchema } from "#database/schema";
import Admin from "#models/admin";

export default class Role extends RoleSchema {
	@column({
		prepare: (value) => (typeof value === "object" ? JSON.stringify(value) : value),
		consume: (value) => (typeof value === "string" ? JSON.parse(value) : value),
	})
	declare authorizations: AuthorizationOption[];

	@hasMany(() => Admin)
	declare admins: HasMany<typeof Admin>;
}
