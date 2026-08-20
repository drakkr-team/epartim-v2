import { createHash, randomBytes } from "node:crypto";

import redis from "@adonisjs/redis/services/main";
import { DateTime } from "luxon";

import User from "#models/user";

const INVITATION_TTL_IN_DAYS = 7;

export type StoredUserInvitation = {
	userId: number;
	invitedByUserId: number | null;
	email: string;
	tokenHash: string;
	sentAt: string;
	expiresAt: string;
};

export type CreatedUserInvitation = StoredUserInvitation & {
	clearToken: string;
};

export type UserInvitationView = {
	id: number;
	sentAt: DateTime | null;
	expiresAt: DateTime;
	acceptedAt: DateTime | null;
	revokedAt: DateTime | null;
};

export default class UserInvitationStoreService {
	async create(user: User, invitedByUserId: number | null) {
		const existingInvitation = await this.getByUserId(user.id);
		if (existingInvitation) {
			await this.invalidate(existingInvitation);
		}

		const clearToken = randomBytes(32).toString("base64url");
		const sentAt = DateTime.now();
		const expiresAt = sentAt.plus({ days: INVITATION_TTL_IN_DAYS });
		const invitation = {
			userId: user.id,
			invitedByUserId,
			email: user.email,
			tokenHash: this.#createHash(clearToken),
			sentAt: sentAt.toISO()!,
			expiresAt: expiresAt.toISO()!,
		} satisfies StoredUserInvitation;

		await this.restore(invitation);

		return {
			...invitation,
			clearToken,
		} satisfies CreatedUserInvitation;
	}

	async getByUserId(userId: number) {
		const payload = await redis.get(this.#getUserKey(userId));
		return this.#parse(payload);
	}

	async getByUserIds(userIds: number[]) {
		const invitations = await Promise.all(userIds.map((userId) => this.getByUserId(userId)));
		return new Map(
			invitations.flatMap((invitation) =>
				invitation ? [[invitation.userId, invitation] as const] : [],
			),
		);
	}

	async consume(token: string) {
		const payload = await redis.getdel(this.#getTokenKey(this.#createHash(token)));
		return this.#parse(payload);
	}

	async restore(invitation: StoredUserInvitation) {
		const ttl = this.#getTtlInSeconds(invitation.expiresAt);
		if (ttl <= 0) {
			return;
		}

		const payload = JSON.stringify(invitation);
		await redis.setex(this.#getUserKey(invitation.userId), ttl, payload);
		await redis.setex(this.#getTokenKey(invitation.tokenHash), ttl, payload);
	}

	async invalidate(invitation: StoredUserInvitation) {
		await redis.del(this.#getUserKey(invitation.userId));
		await redis.del(this.#getTokenKey(invitation.tokenHash));
	}

	async invalidateByUserId(userId: number) {
		const invitation = await this.getByUserId(userId);
		if (invitation) {
			await this.invalidate(invitation);
		}
	}

	toView(invitation: StoredUserInvitation | null): UserInvitationView | null {
		if (!invitation) {
			return null;
		}

		return {
			id: invitation.userId,
			sentAt: DateTime.fromISO(invitation.sentAt),
			expiresAt: DateTime.fromISO(invitation.expiresAt),
			acceptedAt: null,
			revokedAt: null,
		};
	}

	#createHash(token: string) {
		return createHash("sha256").update(token).digest("hex");
	}

	#getUserKey(userId: number) {
		return `user-invitation:user:${userId}`;
	}

	#getTokenKey(tokenHash: string) {
		return `user-invitation:token:${tokenHash}`;
	}

	#getTtlInSeconds(expiresAt: string) {
		return Math.ceil(DateTime.fromISO(expiresAt).diffNow("seconds").seconds);
	}

	#parse(payload: string | null) {
		if (!payload) {
			return null;
		}

		return JSON.parse(payload) as StoredUserInvitation;
	}
}
