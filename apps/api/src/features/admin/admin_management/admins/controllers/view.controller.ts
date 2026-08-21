import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";

import ViewAdminPolicy from "#features/admin/admin_management/admins/policies/view.policy";
import Admin from "#models/admin";
import AdminPresenter from "#presenters/admin.presenter";

@inject()
export default class ViewAdminController {
	constructor(protected adminPresenter: AdminPresenter) {}

	async handle({ params, response, bouncer }: HttpContext) {
		await bouncer.with(ViewAdminPolicy).authorize("handle");

		const id = Number(params.id);

		if (!Number.isSafeInteger(id) || id < 1) {
			return response.notFound();
		}

		const admin = await Admin.find(id);

		if (!admin) {
			return response.notFound();
		}

		return this.adminPresenter.toJSON(admin);
	}
}
