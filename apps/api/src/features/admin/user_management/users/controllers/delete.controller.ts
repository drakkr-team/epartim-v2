import { HttpContext } from "@adonisjs/core/http";

import DeleteUserPolicy from "#features/admin/user_management/users/policies/delete.policy";
import User from "#models/user";

export default class DeleteUserController {
	async handle({ params, response, bouncer }: HttpContext) {
		const id = Number(params.id);

		if (!Number.isSafeInteger(id) || id < 1) {
			return response.notFound();
		}

		const user = await User.find(id);

		if (!user) {
			return response.notFound();
		}

		await bouncer.with(DeleteUserPolicy).authorize("handle", user);
		await user.delete();

		return response.noContent();
	}
}
