import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";

import DeleteProfilePolicy from "#features/admin/admin_management/profile/policies/delete.policy";
import ProfileService from "#features/admin/admin_management/profile/services/profile.service";

@inject()
export default class DeleteProfileController {
	constructor(protected profileService: ProfileService) {}

	async handle({ bouncer }: HttpContext) {
		await bouncer.with(DeleteProfilePolicy).authorize("handle");

		await this.profileService.delete();

		return null;
	}
}
