import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";

import DeleteProfilePolicy from "#features/user_management/profile/policies/delete.policy";
import ProfileService from "#features/user_management/profile/services/profile.service";

@inject()
export default class DeleteProfileController {
	constructor(protected profileService: ProfileService) {}

	async handle({ bouncer }: HttpContext) {
		await bouncer.with(DeleteProfilePolicy).authorize("handle");

		await this.profileService.delete();

		return null;
	}
}
