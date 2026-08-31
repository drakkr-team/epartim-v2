import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";

import DeleteNetworkPolicy from "#features/admin/networks/policies/delete.policy";
import DeleteNetworkService from "#features/admin/networks/services/delete.service";

@inject()
export default class DeleteNetworkController {
	constructor(private deleteNetworkService: DeleteNetworkService) {}

	async handle({ params, response, bouncer }: HttpContext) {
		const { networkId } = params;

		await bouncer.with(DeleteNetworkPolicy).authorize("handle");
		await this.deleteNetworkService.execute(networkId);

		return response.noContent();
	}
}
