import type Network from "#models/network";

export default class NetworkPresenter {
	toJSON(network: Network) {
		return {
			id: network.id,

			name: network.name,
			amundiOrgId: network.amundiOrgId,
			addressId: network.addressId,
			goCode: network.goCode,

			createdAt: network.createdAt.toJSDate(),
			updatedAt: network.updatedAt.toJSDate(),
		};
	}
}
