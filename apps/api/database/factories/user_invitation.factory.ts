import factory from "@adonisjs/lucid/factories";
import { DateTime } from "luxon";

import { UserFactory } from "#database/factories/user.factory";
import UserInvitation from "#models/user_invitation";

export const UserInvitationFactory = factory
	.define(UserInvitation, ({ faker }) => {
		return {
			tokenHash: faker.string.alphanumeric(64),
			email: faker.internet.exampleEmail(),
			expiresAt: DateTime.now().plus({ days: 7 }),
		};
	})
	.relation("user", () => UserFactory)
	.state("sent", (invitation) => {
		invitation.sentAt = DateTime.now();
	})
	.state("accepted", (invitation) => {
		invitation.acceptedAt = DateTime.now();
	})
	.state("revoked", (invitation) => {
		invitation.revokedAt = DateTime.now();
	})
	.build();
