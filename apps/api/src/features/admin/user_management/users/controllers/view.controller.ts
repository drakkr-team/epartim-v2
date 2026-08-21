import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";

import ViewUserPolicy from "#features/admin/user_management/users/policies/view.policy";
import User from "#models/user";
import UserPresenter from "#presenters/user.presenter";

@inject()
export default class ViewUserController {
	constructor(protected userPresenter: UserPresenter) {}

	async handle({ params, response, bouncer }: HttpContext) {
		await bouncer.with(ViewUserPolicy).authorize("handle");

		const id = Number(params.id);

		if (!Number.isSafeInteger(id) || id < 1) {
			return response.notFound();
		}

		const user = await User.find(id);

		if (!user) {
			return response.notFound();
		}

		return this.userPresenter.toJSON(user);
	}
}
