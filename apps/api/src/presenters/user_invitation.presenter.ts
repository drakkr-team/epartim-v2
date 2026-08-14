import type UserInvitation from "#models/user_invitation";

export default class UserInvitationPresenter {
	toJSON(invitation: UserInvitation | null) {
		if (!invitation) return null;

		return {
			id: invitation.id,
			sentAt: invitation.sentAt?.toJSDate() ?? null,
			expiresAt: invitation.expiresAt.toJSDate(),
			acceptedAt: invitation.acceptedAt?.toJSDate() ?? null,
			revokedAt: invitation.revokedAt?.toJSDate() ?? null,
		};
	}
}
