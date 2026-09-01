import { inject } from "@adonisjs/core";

import type Network from "#models/network";

@inject()
export default class NetworkPresenter {
	toJSON(network: Network) {
		return {
			id: network.id,
			amundiOrgId: network.amundiOrgId,

			name: network.name,
			goCode: network.goCode,

			addressId: network.addressId,
			paymentDetailId: network.paymentDetailId,

			createdAt: network.createdAt.toJSDate(),
			updatedAt: network.updatedAt.toJSDate(),
		};
	}
}
