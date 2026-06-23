import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";

import ViewProfilePolicy from "#features/user_management/profile/policies/view.policy";
import UserPresenter from "#presenters/user.presenter";

@inject()
export default class ViewProfileController {
	constructor(protected userPresenter: UserPresenter) {}

	async handle({ auth, bouncer }: HttpContext) {
		await bouncer.with(ViewProfilePolicy).authorize("handle");

		const user = auth.user!;

		return this.userPresenter.toJSON(user);
	}
}
