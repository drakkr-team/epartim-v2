import { inject } from "@adonisjs/core";
import db from "@adonisjs/lucid/services/db";
import { DateTime } from "luxon";

import EmailAlreadyExistsException from "#exceptions/email_already_exists.exception";
import ForbiddenUserOperationException from "#exceptions/forbidden_user_operation.exception";
import InvalidUserAssignmentException from "#exceptions/invalid_user_assignment.exception";
import InvalidUserStateException from "#exceptions/invalid_user_state.exception";
import SendAccountInvitation from "#features/admin/users/jobs/send_account_invitation.job";
import UserInvitationStoreService, {
	type CreatedUserInvitation,
} from "#features/admin/users/services/user_invitation_store.service";
import Firm from "#models/firm";
import Network from "#models/network";
import Role, { type RoleCode } from "#models/role";
import User from "#models/user";
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

@inject()
export default class AdminUserService {
	constructor(private userInvitationStore: UserInvitationStoreService) {}

	async list(filters: { status?: string; role?: string; firmId?: number; networkId?: number }) {
		const query = User.query()
			.preload("roles")
			.preload("firm", (firmQuery) => firmQuery.preload("network"))
			.preload("network");

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
			.firstOrFail();
	}

	async create(input: Required<Pick<UserInput, "email">> & UserInput, invitedBy: User) {
		const email = input.email.trim().toLowerCase();
		if (await User.findBy("email", email)) {
			throw new EmailAlreadyExistsException();
		}

		const assignment = await this.resolveAssignment(input);
		const transaction = await db.transaction();
		let committed = false;

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

			await transaction.commit();
			committed = true;
			const invitation = await this.createInvitation(user, invitedBy);
			await this.dispatchInvitation(user, invitation);

			return user;
		} catch (error) {
			if (!committed) {
				await transaction.rollback();
			}
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

		const invitation = await this.createInvitation(user, invitedBy);
		await this.dispatchInvitation(user, invitation);
		return this.userInvitationStore.toView(invitation);
	}

	async cancelInvitation(user: User) {
		if (user.status !== "invited") throw new InvalidUserStateException();

		await this.userInvitationStore.invalidateByUserId(user.id);
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

	async getInvitation(userId: number) {
		return this.userInvitationStore.toView(await this.userInvitationStore.getByUserId(userId));
	}

	async getInvitations(userIds: number[]) {
		const invitations = await this.userInvitationStore.getByUserIds(userIds);
		return new Map(
			userIds.map((userId) => [
				userId,
				this.userInvitationStore.toView(invitations.get(userId) ?? null),
			]),
		);
	}

	private async createInvitation(user: User, invitedBy: User) {
		return this.userInvitationStore.create(user, invitedBy.id);
	}

	private async dispatchInvitation(user: User, invitation: CreatedUserInvitation) {
		const activationUrl = new URL("/activate-account", env.get("FRONTEND_URL"));
		activationUrl.searchParams.set("token", invitation.clearToken);
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
