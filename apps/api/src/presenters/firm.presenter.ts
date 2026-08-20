import type Firm from "#models/firm";

export default class FirmPresenter {
	toJSON(firm: Firm) {
		return {
			id: firm.id,

			name: firm.name,
			amundiOrgId: firm.amundiOrgId,
			networkId: firm.networkId,
			addressId: firm.addressId,
			orias: firm.orias,

			createdAt: firm.createdAt.toJSDate(),
			updatedAt: firm.updatedAt.toJSDate(),
		};
	}
}
