import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";

import SendAccountDeletedNotification from "#features/client/account_management/profile/jobs/send_account_deleted_notification.job";
import User from "#models/user";

@inject()
export default class ProfileService {
	constructor(protected ctx: HttpContext) {}

	async delete() {
		const user = this.ctx.auth.user as User;

		await user.delete();
		await SendAccountDeletedNotification.dispatch({ user });
		await this.ctx.auth.use("client").logout();
	}
}
