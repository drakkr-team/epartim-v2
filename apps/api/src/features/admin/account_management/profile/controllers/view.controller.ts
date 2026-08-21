import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";

import ViewProfilePolicy from "#features/admin/account_management/profile/policies/view.policy";
import Admin from "#models/admin";
import AdminPresenter from "#presenters/admin.presenter";

@inject()
export default class ViewProfileController {
	constructor(protected adminPresenter: AdminPresenter) {}

	async handle({ auth, bouncer }: HttpContext) {
		await bouncer.with(ViewProfilePolicy).authorize("handle");

		const admin = auth.user as Admin;

		return this.adminPresenter.toJSON(admin);
	}
}
