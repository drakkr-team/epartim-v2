import type Address from "#models/address";

export default class AddressPresenter {
	toJSON(address: Address) {
		return {
			id: address.id,

			lineOne: address.lineOne,
			lineTwo: address.lineTwo,
			zip: address.zip,
			city: address.city,
			coordinates: address.coordinates,
		};
	}
}
