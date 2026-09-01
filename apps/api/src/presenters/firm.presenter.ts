import type Firm from "#models/firm";

export default class FirmPresenter {
	toJSON(firm: Firm) {
		return {
			id: firm.id,

			name: firm.name,
			orias: firm.orias,
			amundiOrgId: firm.amundiOrgId,

			paymentDetailId: firm.paymentDetailId,
			networkId: firm.networkId,
			addressId: firm.addressId,

			createdAt: firm.createdAt.toJSDate(),
			updatedAt: firm.updatedAt.toJSDate(),
		};
	}
}
