import { createHash } from "node:crypto";

import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import db from "@adonisjs/lucid/services/db";
import { DateTime } from "luxon";

import InvalidTokenException from "#exceptions/invalid_token.exception";
import InvalidUserStateException from "#exceptions/invalid_user_state.exception";
import UserInvitation from "#models/user_invitation";

@inject()
export default class InvitationActivationService {
	constructor(private ctx: HttpContext) {}

	async accept(token: string, password: string) {
		const transaction = await db.transaction();
		try {
			const tokenHash = createHash("sha256").update(token).digest("hex");
			const invitation = await UserInvitation.query({ client: transaction })
				.where("token_hash", tokenHash)
				.whereNull("accepted_at")
				.whereNull("revoked_at")
				.where("expires_at", ">", DateTime.now().toSQL()!)
				.preload("user")
				.forUpdate()
				.first();

			if (!invitation) throw new InvalidTokenException();
			if (invitation.user.status !== "invited") throw new InvalidUserStateException();

			invitation.user.useTransaction(transaction);
			await invitation.user.merge({ password, status: "active" }).save();
			invitation.useTransaction(transaction);
			await invitation.merge({ acceptedAt: DateTime.now() }).save();
			await transaction.commit();

			await this.ctx.auth.use("client").login(invitation.user);
			this.ctx.session.put("authVersion", invitation.user.authVersion);

			return invitation.user;
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}
}
