import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";

import DeleteFirmPolicy from "#features/admin/firms/policies/delete.policy";
import DeleteFirmService from "#features/admin/firms/services/delete.service";

@inject()
export default class DeleteFirmController {
	constructor(protected deleteFirmService: DeleteFirmService) {}

	async handle({ params, response, bouncer }: HttpContext) {
		await bouncer.with(DeleteFirmPolicy).authorize("handle");

		await this.deleteFirmService.handle(params.firmId);

		return response.noContent();
	}
}
