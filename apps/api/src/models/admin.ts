import { withAuthFinder } from "@adonisjs/auth/mixins/lucid";
import { compose } from "@adonisjs/core/helpers";
import hash from "@adonisjs/core/services/hash";
import { column } from "@adonisjs/lucid/orm";

import { AdminSchema } from "#database/schema";

const authFinder = withAuthFinder(() => hash.use("scrypt"), {
	uids: ["email"],
	passwordColumnName: "password",
});

export default class Admin extends compose(AdminSchema, authFinder) {
	@column({ isPrimary: true })
	declare id: number;
}
