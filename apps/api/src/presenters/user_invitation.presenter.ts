import type { UserInvitationView } from "#features/admin/users/services/user_invitation_store.service";

export default class UserInvitationPresenter {
	toJSON(invitation: UserInvitationView | null) {
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
