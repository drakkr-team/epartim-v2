import db from "@adonisjs/lucid/services/db";

import NetworkValidationException from "#exceptions/network_validation.exception";
import { normalizePaymentDetails } from "#features/admin/networks/services/payment_details.service";
import Address from "#models/address";
import Network from "#models/network";
import PaymentDetail from "#models/payment_detail";

interface Coordinates {
	latitude: number;
	longitude: number;
}

export interface CreateNetworkPayload {
	name: string;
	amundiOrgId?: string | null;
	goCode?: number | null;
	address: {
		lineOne: string;
		lineTwo?: string | null;
		zip: string;
		city: string;
		coordinates?: Coordinates | null;
	};
	paymentDetails: {
		iban: string;
		bic: string;
	};
}

export default class CreateNetworkService {
	async execute(payload: CreateNetworkPayload) {
		const normalizedPaymentDetails = normalizePaymentDetails(payload.paymentDetails);

		try {
			return await db.transaction(async (transaction) => {
				const address = await Address.create(
					{
						...payload.address,
						lineTwo: payload.address.lineTwo ?? null,
						coordinates: payload.address.coordinates ?? null,
					},
					{ client: transaction },
				);
				const paymentDetails = await PaymentDetail.create(normalizedPaymentDetails, {
					client: transaction,
				});
				const network = await Network.create(
					{
						name: payload.name,
						amundiOrgId: payload.amundiOrgId ?? null,
						goCode: payload.goCode ?? null,
						addressId: address.id,
						paymentDetailsId: paymentDetails.id,
					},
					{ client: transaction },
				);

				network.$setRelated("address", address);
				network.$setRelated("paymentDetails", paymentDetails);

				return network;
			});
		} catch (error) {
			if (isUniqueConstraintViolation(error)) {
				throw new NetworkValidationException("The network name or Amundi ID is already used.");
			}

			throw error;
		}
	}
}

function isUniqueConstraintViolation(error: unknown) {
	return typeof error === "object" && error !== null && "code" in error && error.code === "23505";
}
