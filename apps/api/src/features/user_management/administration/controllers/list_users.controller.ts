import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";

import AdminUserService from "#features/user_management/administration/services/admin_user.service";
import UserPresenter from "#presenters/user.presenter";
import UserInvitationPresenter from "#presenters/user_invitation.presenter";

@inject()
export default class ListUsersController {
	constructor(
		private adminUserService: AdminUserService,
		private userPresenter: UserPresenter,
		private userInvitationPresenter: UserInvitationPresenter,
	) {}

	async handle({ request }: HttpContext) {
		const filters = request.qs();
		const users = await this.adminUserService.list({
			status: filters.status,
			role: filters.role,
			firmId: filters.firmId ? Number(filters.firmId) : undefined,
			networkId: filters.networkId ? Number(filters.networkId) : undefined,
		});

		return Promise.all(
			users.map(async (user) => ({
				...(await this.userPresenter.toJSON(user)),
				invitation: this.userInvitationPresenter.toJSON(user.invitations[0] || null),
			})),
		);
	}
}
