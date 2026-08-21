import { HttpContext } from "@adonisjs/core/http";

import DeleteAdminPolicy from "#features/admin/admin_management/admins/policies/delete.policy";
import Admin from "#models/admin";

export default class DeleteAdminController {
	async handle({ params, response, bouncer }: HttpContext) {
		const id = Number(params.id);

		if (!Number.isSafeInteger(id) || id < 1) {
			return response.notFound();
		}

		const admin = await Admin.find(id);

		if (!admin) {
			return response.notFound();
		}

		await bouncer.with(DeleteAdminPolicy).authorize("handle", admin);
		await admin.delete();

		return response.noContent();
	}
}
