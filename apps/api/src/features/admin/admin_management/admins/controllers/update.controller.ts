import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import UpdateAdminPolicy from "#features/admin/admin_management/admins/policies/update.policy";
import Admin from "#models/admin";
import AdminPresenter from "#presenters/admin.presenter";
import { UpdateAdminSchema } from "#validators/admin.validator";

@inject()
export default class UpdateAdminController {
	constructor(protected adminPresenter: AdminPresenter) {}

	async handle({ params, request, response, bouncer }: HttpContext) {
		await bouncer.with(UpdateAdminPolicy).authorize("handle");

		const id = Number(params.id);

		if (!Number.isSafeInteger(id) || id < 1) {
			return response.notFound();
		}

		const admin = await Admin.find(id);

		if (!admin) {
			return response.notFound();
		}

		const payload = await request.validateUsing(UpdateAdminController.payloadSchema);

		await admin.merge(payload).save();

		return this.adminPresenter.toJSON(admin);
	}

	static payloadSchema = vine.create(UpdateAdminSchema);
}
