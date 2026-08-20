import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import db from "@adonisjs/lucid/services/db";

import InvalidTokenException from "#exceptions/invalid_token.exception";
import InvalidUserStateException from "#exceptions/invalid_user_state.exception";
import UserInvitationStoreService from "#features/admin/users/services/user_invitation_store.service";
import User from "#models/user";

@inject()
export default class InvitationActivationService {
	constructor(
		private ctx: HttpContext,
		private userInvitationStore: UserInvitationStoreService,
	) {}

	async accept(token: string, password: string) {
		const invitation = await this.userInvitationStore.consume(token);
		if (!invitation) throw new InvalidTokenException();

		const transaction = await db.transaction();
		let committed = false;
		try {
			const user = await User.query({ client: transaction })
				.where("id", invitation.userId)
				.forUpdate()
				.first();

			if (!user) throw new InvalidTokenException();
			if (user.status !== "invited") throw new InvalidUserStateException();

			user.useTransaction(transaction);
			await user.merge({ password, status: "active" }).save();
			await transaction.commit();
			committed = true;
		} catch (error) {
			if (!committed) {
				await transaction.rollback();
			}
			if (
				!committed &&
				!(error instanceof InvalidTokenException) &&
				!(error instanceof InvalidUserStateException)
			) {
				await this.userInvitationStore.restore(invitation);
			}
			throw error;
		}

		await this.userInvitationStore.invalidate(invitation);
		const user = await User.findOrFail(invitation.userId);
		await this.ctx.auth.use("client").login(user);
		this.ctx.session.put("authVersion", user.authVersion);

		return user;
	}
}
