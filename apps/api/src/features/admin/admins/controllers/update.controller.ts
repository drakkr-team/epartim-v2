import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import UpdateAdminPolicy from "#features/admin/admins/policies/update.policy";
import Admin from "#models/admin";
import AdminPresenter from "#presenters/admin.presenter";
import { UpdateAdminSchema } from "#validators/admin.validator";

@inject()
export default class UpdateAdminController {
	constructor(protected adminPresenter: AdminPresenter) {}

	async handle({ params, request, bouncer }: HttpContext) {
		const { adminId } = params;

		await bouncer.with(UpdateAdminPolicy).authorize("handle");

		const payload = await request.validateUsing(UpdateAdminController.payloadSchema);

		const admin = await Admin.findOrFail(adminId);
		await admin.merge(payload).save();

		return this.adminPresenter.toJSON(admin);
	}

	static payloadSchema = vine.create(UpdateAdminSchema);
}
