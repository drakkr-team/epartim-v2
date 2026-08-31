import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import CreateNetworkPolicy from "#features/admin/networks/policies/create.policy";
import DeleteNetworkPolicy from "#features/admin/networks/policies/delete.policy";
import ListNetworksPolicy from "#features/admin/networks/policies/list.policy";
import UpdateNetworkPolicy from "#features/admin/networks/policies/update.policy";
import ListNetworksService from "#features/admin/networks/services/list.service";
import NetworkPresenter from "#presenters/network.presenter";
import { ListNetworksQuerySchema } from "#validators/network.validator";

@inject()
export default class ListNetworksController {
	constructor(
		private listNetworksService: ListNetworksService,
		private networkPresenter: NetworkPresenter,
	) {}

	async handle({ request, bouncer }: HttpContext) {
		await bouncer.with(ListNetworksPolicy).authorize("handle");

		const {
			page = 1,
			perPage = 20,
			q,
			orderBy,
		} = await request.validateUsing(ListNetworksController.querySchema);
		const networks = await this.listNetworksService.handle({ q, orderBy }).paginate(page, perPage);
		const [canCreate, canUpdate, canDelete] = await Promise.all([
			bouncer.with(CreateNetworkPolicy).allows("handle"),
			bouncer.with(UpdateNetworkPolicy).allows("handle"),
			bouncer.with(DeleteNetworkPolicy).allows("handle"),
		]);

		return {
			meta: {
				page: networks.currentPage,
				perPage: networks.perPage,
				total: networks.total,
				canCreate,
			},
			data: networks.all().map((network) => ({
				...this.networkPresenter.toJSON(network),
				meta: {
					canUpdate,
					canDelete,
				},
			})),
		};
	}

	static querySchema = vine.create(ListNetworksQuerySchema);
}
