import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";

import DeleteNetworkPolicy from "#features/admin/networks/policies/delete.policy";
import DeleteNetworkService from "#features/admin/networks/services/delete.service";
import Network from "#models/network";

@inject()
export default class DeleteNetworkController {
	constructor(protected deleteNetworkService: DeleteNetworkService) {}

	async handle({ params, response, bouncer }: HttpContext) {
		const { networkId } = params;

		await bouncer.with(DeleteNetworkPolicy).authorize("handle");

		const network = await Network.findOrFail(networkId);
		await this.deleteNetworkService.handle(network);

		return response.noContent();
	}
}
