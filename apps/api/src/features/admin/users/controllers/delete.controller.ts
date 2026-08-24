import { HttpContext } from "@adonisjs/core/http";

import DeleteUserPolicy from "#features/admin/users/policies/delete.policy";
import User from "#models/user";

export default class DeleteUserController {
	async handle({ params, response, bouncer }: HttpContext) {
		const { userId } = params;

		await bouncer.with(DeleteUserPolicy).authorize("handle", userId);

		const user = await User.findOrFail(userId);
		await user.delete();

		return response.noContent();
	}
}
