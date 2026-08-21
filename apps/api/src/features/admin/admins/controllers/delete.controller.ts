import { HttpContext } from "@adonisjs/core/http";

import DeleteAdminPolicy from "#features/admin/admins/policies/delete.policy";
import Admin from "#models/admin";

export default class DeleteAdminController {
	async handle({ params, response, bouncer }: HttpContext) {
		const { adminId } = params;

		await bouncer.with(DeleteAdminPolicy).authorize("handle", adminId);

		const admin = await Admin.findOrFail(adminId);
		await admin.delete();

		return response.noContent();
	}
}
