import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";

import AdminUserService from "#features/admin/users/services/admin_user.service";
import UserInvitationPresenter from "#presenters/user_invitation.presenter";

@inject()
export default class ResendInvitationController {
	constructor(
		private adminUserService: AdminUserService,
		private userInvitationPresenter: UserInvitationPresenter,
	) {}

	async handle({ request, auth }: HttpContext) {
		const user = await this.adminUserService.find(Number(request.param("id")));
		const invitation = await this.adminUserService.resend(user, auth.user!);
		return this.userInvitationPresenter.toJSON(invitation);
	}
}
