import { createHash, randomBytes } from "node:crypto";

import db from "@adonisjs/lucid/services/db";
import type { TransactionClientContract } from "@adonisjs/lucid/types/database";
import { DateTime } from "luxon";

import EmailAlreadyExistsException from "#exceptions/email_already_exists.exception";
import ForbiddenUserOperationException from "#exceptions/forbidden_user_operation.exception";
import InvalidUserAssignmentException from "#exceptions/invalid_user_assignment.exception";
import InvalidUserStateException from "#exceptions/invalid_user_state.exception";
import SendAccountInvitation from "#features/user_management/administration/jobs/send_account_invitation.job";
import Firm from "#models/firm";
import Network from "#models/network";
import Role, { type RoleCode } from "#models/role";
import User from "#models/user";
import UserInvitation from "#models/user_invitation";
import env from "#start/env";

export type UserInput = {
	email?: string;
	firstName: string;
	lastName: string;
	mobilePhone?: string | null;
	roleCode: RoleCode;
	firmId?: number | null;
	networkId?: number | null;
};

export default class AdminUserService {
	async list(filters: { status?: string; role?: string; firmId?: number; networkId?: number }) {
		const query = User.query()
			.preload("roles")
			.preload("firm", (firmQuery) => firmQuery.preload("network"))
			.preload("network")
			.preload("invitations", (invitationQuery) => invitationQuery.orderBy("created_at", "desc"));

		if (filters.status) query.where("status", filters.status);
		if (filters.firmId) query.where("firm_id", filters.firmId);
		if (filters.networkId) {
			query.where((networkQuery) => {
				networkQuery.where("network_id", filters.networkId!).orWhereHas("firm", (firmQuery) => {
					firmQuery.where("network_id", filters.networkId!);
				});
			});
		}
		if (filters.role) {
			query.whereHas("roles", (roleQuery) => roleQuery.where("code", filters.role!));
		}

		return query.orderBy("last_name").orderBy("first_name");
	}

	async find(id: number) {
		return User.query()
			.where("id", id)
			.preload("roles")
			.preload("firm", (firmQuery) => firmQuery.preload("network"))
			.preload("network")
			.preload("invitations", (invitationQuery) => invitationQuery.orderBy("created_at", "desc"))
			.firstOrFail();
	}

	async create(input: Required<Pick<UserInput, "email">> & UserInput, invitedBy: User) {
		const email = input.email.trim().toLowerCase();
		if (await User.findBy("email", email)) {
			throw new EmailAlreadyExistsException();
		}

		const assignment = await this.resolveAssignment(input);
		const transaction = await db.transaction();

		try {
			const user = new User();
			user.useTransaction(transaction);
			user.fill({
				name: `${input.firstName} ${input.lastName}`,
				email,
				password: null as unknown as string,
				firstName: input.firstName,
				lastName: input.lastName,
				mobilePhone: input.mobilePhone || null,
				status: "invited",
				firmId: assignment.firmId,
				networkId: assignment.networkId,
			});
			await user.save();
			await user.related("roles").sync([assignment.role.id]);

			const invitation = await this.createInvitation(user, invitedBy, transaction);
			await transaction.commit();
			await this.dispatchInvitation(user, invitation);

			return user;
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async update(user: User, input: UserInput, actor: User) {
		const assignment = await this.resolveAssignment(input);
		const currentRole = user.roles[0]?.code ?? (await user.related("roles").query().first())?.code;

		if (
			actor.id === user.id &&
			(currentRole !== input.roleCode ||
				user.firmId !== assignment.firmId ||
				user.networkId !== assignment.networkId)
		) {
			throw new ForbiddenUserOperationException();
		}

		user.merge({
			name: `${input.firstName} ${input.lastName}`,
			firstName: input.firstName,
			lastName: input.lastName,
			mobilePhone: input.mobilePhone || null,
			firmId: assignment.firmId,
			networkId: assignment.networkId,
		});
		await user.save();
		await user.related("roles").sync([assignment.role.id]);

		return user;
	}

	async resend(user: User, invitedBy: User) {
		if (user.status !== "invited") throw new InvalidUserStateException();

		const transaction = await db.transaction();
		try {
			const invitation = await this.createInvitation(user, invitedBy, transaction);
			await transaction.commit();
			await this.dispatchInvitation(user, invitation);
			return invitation;
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async cancelInvitation(user: User) {
		if (user.status !== "invited") throw new InvalidUserStateException();

		await UserInvitation.query()
			.where("user_id", user.id)
			.whereNull("accepted_at")
			.whereNull("revoked_at")
			.update({ revokedAt: DateTime.now() });
	}

	async disable(user: User, actor: User) {
		if (user.status !== "active" || user.id === actor.id)
			throw new ForbiddenUserOperationException();
		if (await this.isLastActiveAdministrator(user)) throw new ForbiddenUserOperationException();

		await user
			.merge({ status: "disabled", disabledAt: DateTime.now(), authVersion: user.authVersion + 1 })
			.save();
	}

	async reactivate(user: User) {
		if (user.status !== "disabled") throw new InvalidUserStateException();

		await user
			.merge({ status: "active", disabledAt: null, authVersion: user.authVersion + 1 })
			.save();
	}

	async options() {
		const [roles, firms, networks] = await Promise.all([
			Role.query().whereIn("code", [
				"administrator",
				"commercial",
				"network_manager",
				"distributor",
			]),
			Firm.query().preload("network").orderBy("name"),
			Network.query().orderBy("name"),
		]);

		return { roles, firms, networks };
	}

	private async resolveAssignment(input: UserInput) {
		const role = await Role.findBy("code", input.roleCode);
		if (!role) throw new InvalidUserAssignmentException();

		if (["administrator", "commercial"].includes(input.roleCode)) {
			if (input.firmId || input.networkId) throw new InvalidUserAssignmentException();
			return { role, firmId: null, networkId: null };
		}

		if (input.roleCode === "network_manager") {
			if (!input.networkId || input.firmId || !(await Network.find(input.networkId))) {
				throw new InvalidUserAssignmentException();
			}
			return { role, firmId: null, networkId: input.networkId };
		}

		if (!input.firmId) throw new InvalidUserAssignmentException();
		const firm = await Firm.find(input.firmId);
		if (!firm) throw new InvalidUserAssignmentException();
		if (input.networkId && input.networkId !== firm.networkId)
			throw new InvalidUserAssignmentException();

		return { role, firmId: firm.id, networkId: null };
	}

	private async createInvitation(
		user: User,
		invitedBy: User,
		transaction: TransactionClientContract,
	) {
		await UserInvitation.query({ client: transaction })
			.where("user_id", user.id)
			.whereNull("accepted_at")
			.whereNull("revoked_at")
			.update({ revokedAt: DateTime.now() });

		const token = randomBytes(32).toString("base64url");
		const invitation = new UserInvitation();
		invitation.useTransaction(transaction);
		invitation.fill({
			userId: user.id,
			invitedByUserId: invitedBy.id,
			tokenHash: createHash("sha256").update(token).digest("hex"),
			email: user.email,
			sentAt: DateTime.now(),
			expiresAt: DateTime.now().plus({ days: 7 }),
		});
		await invitation.save();

		invitation.$extras.clearToken = token;
		return invitation;
	}

	private async dispatchInvitation(user: User, invitation: UserInvitation) {
		const activationUrl = new URL("/activate-account", env.get("FRONTEND_URL"));
		activationUrl.searchParams.set("token", invitation.$extras.clearToken as string);
		await SendAccountInvitation.dispatch({ user, activationUrl });
	}

	private async isLastActiveAdministrator(user: User) {
		const role = await user.related("roles").query().where("code", "administrator").first();
		if (!role) return false;

		const administrators = await User.query()
			.where("status", "active")
			.whereHas("roles", (roleQuery) => roleQuery.where("code", "administrator"))
			.count("id as total");

		return Number(administrators[0].$extras.total) <= 1;
	}
}
