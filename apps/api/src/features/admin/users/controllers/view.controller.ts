import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";

import DeleteUserPolicy from "#features/admin/users/policies/delete.policy";
import UpdateUserPolicy from "#features/admin/users/policies/update.policy";
import ViewUserPolicy from "#features/admin/users/policies/view.policy";
import User from "#models/user";
import UserPresenter from "#presenters/user.presenter";

@inject()
export default class ViewUserController {
	constructor(protected userPresenter: UserPresenter) {}

	async handle({ params, bouncer }: HttpContext) {
		const { userId } = params;

		await bouncer.with(ViewUserPolicy).authorize("handle");

		const user = await User.findOrFail(userId);

		return {
			...this.userPresenter.toJSON(user),
			meta: {
				canUpdate: await bouncer.with(UpdateUserPolicy).allows("handle"),
				canDelete: await bouncer.with(DeleteUserPolicy).allows("handle", user.id),
			},
		};
	}
}
