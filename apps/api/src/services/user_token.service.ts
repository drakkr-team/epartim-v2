import StringHelpers from "@adonisjs/core/helpers/string";
import { DateTime } from "luxon";

import InvalidTokenException from "#exceptions/invalid_token.exception";
import User from "#models/user";
import UserToken, { UserTokenType } from "#models/user_token";

export default class UserTokenService {
	async generate(params: { user: User; type: UserTokenType; expiresAt: DateTime }) {
		const { user, type, expiresAt } = params;

		const token = StringHelpers.random(64);

		await this.revokeAll({ user, type });
		const record = await user.related("tokens").create({
			type,
			token,
			expiresAt,
		});

		return record.token;
	}

	async verify(params: { token: string; type: UserTokenType }) {
		const { token, type } = params;

		const record = await UserToken.query()
			.preload("user")
			.where("type", type)
			.where("token", token)
			.where("expires_at", ">", DateTime.now().toSQL())
			.first();

		if (!record) {
			throw new InvalidTokenException();
		}

		return record.user;
	}

	async revokeAll(params: { user: User; type: UserTokenType }) {
		const { user, type } = params;

		await user.related("tokens").query().where("type", type).delete();
	}
}
