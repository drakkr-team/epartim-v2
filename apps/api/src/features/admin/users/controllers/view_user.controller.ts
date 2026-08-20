import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";

import AdminUserService from "#features/admin/users/services/admin_user.service";
import UserPresenter from "#presenters/user.presenter";
import UserInvitationPresenter from "#presenters/user_invitation.presenter";

@inject()
export default class ViewUserController {
	constructor(
		private adminUserService: AdminUserService,
		private userPresenter: UserPresenter,
		private userInvitationPresenter: UserInvitationPresenter,
	) {}

	async handle({ request }: HttpContext) {
		const user = await this.adminUserService.find(Number(request.param("id")));
		return {
			...(await this.userPresenter.toJSON(user)),
			invitation: this.userInvitationPresenter.toJSON(user.invitations[0] || null),
		};
	}
}
