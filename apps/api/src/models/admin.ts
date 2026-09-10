import { withAuthFinder } from "@adonisjs/auth/mixins/lucid";
import { compose } from "@adonisjs/core/helpers";
import hash from "@adonisjs/core/services/hash";
import { belongsTo, column } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";

import { AdminSchema } from "#database/schema";
import type { AuthorizationOption } from "#models/role";
import Role from "#models/role";

const authFinder = withAuthFinder(() => hash.use("scrypt"), {
	uids: ["email"],
	passwordColumnName: "password",
});

export default class Admin extends compose(AdminSchema, authFinder) {
	@column({ isPrimary: true })
	declare id: number;

	@belongsTo(() => Role)
	declare role: BelongsTo<typeof Role>;

	async can(action: AuthorizationOption) {
		const role = await Role.find(this.roleId);
		if (role === null) return false;

		return role.isSuperAdmin || role.authorizations.includes(action);
	}
}
