import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";

import DeleteNetworkPolicy from "#features/admin/networks/policies/delete.policy";
import UpdateNetworkPolicy from "#features/admin/networks/policies/update.policy";
import ViewNetworkPolicy from "#features/admin/networks/policies/view.policy";
import ViewNetworkService from "#features/admin/networks/services/view.service";
import NetworkPresenter from "#presenters/network.presenter";

@inject()
export default class ViewNetworkController {
	constructor(
		private viewNetworkService: ViewNetworkService,
		private networkPresenter: NetworkPresenter,
	) {}

	async handle({ params, bouncer }: HttpContext) {
		const { networkId } = params;

		await bouncer.with(ViewNetworkPolicy).authorize("handle");

		const network = await this.viewNetworkService.handle(networkId);
		const [canUpdate, canDelete] = await Promise.all([
			bouncer.with(UpdateNetworkPolicy).allows("handle"),
			bouncer.with(DeleteNetworkPolicy).allows("handle"),
		]);

		return {
			...this.networkPresenter.toJSON(network),
			meta: {
				canUpdate,
				canDelete,
			},
		};
	}
}
