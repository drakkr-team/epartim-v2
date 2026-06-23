import { belongsTo } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";

import { UserTokenSchema } from "#database/schema";
import User from "#models/user";

export const UserTokenType = {
	RESET_PASSWORD: 0,
} as const;

export type UserTokenType = (typeof UserTokenType)[keyof typeof UserTokenType];

export default class UserToken extends UserTokenSchema {
	@belongsTo(() => User)
	declare user: BelongsTo<typeof User>;
}
