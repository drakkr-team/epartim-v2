import db from "@adonisjs/lucid/services/db";

import NetworkValidationException from "#exceptions/network_validation.exception";
import { normalizePaymentDetails } from "#features/admin/networks/services/payment_details.service";
import Network from "#models/network";

interface Coordinates {
	latitude: number;
	longitude: number;
}

export interface UpdateNetworkPayload {
	name?: string;
	amundiOrgId?: string | null;
	goCode?: number | null;
	address?: {
		lineOne?: string;
		lineTwo?: string | null;
		zip?: string;
		city?: string;
		coordinates?: Coordinates | null;
	};
	paymentDetails?: {
		iban?: string;
		bic?: string;
	};
}

export default class UpdateNetworkService {
	async execute(networkId: string | number | bigint, payload: UpdateNetworkPayload) {
		if (!hasModifiableFields(payload)) {
			throw new NetworkValidationException("At least one modifiable field is required.");
		}

		try {
			return await db.transaction(async (transaction) => {
				const network = await Network.query({ client: transaction })
					.where("id", String(networkId))
					.preload("address")
					.preload("paymentDetails")
					.firstOrFail();

				if (payload.name !== undefined) {
					const duplicateName = await Network.query({ client: transaction })
						.where("name", payload.name)
						.whereNot("id", String(network.id))
						.first();
					if (duplicateName) {
						throw new NetworkValidationException("The network name is already used.");
					}
				}

				if (payload.amundiOrgId !== undefined && payload.amundiOrgId !== null) {
					const duplicateAmundiId = await Network.query({ client: transaction })
						.where("amundi_org_id", payload.amundiOrgId)
						.whereNot("id", String(network.id))
						.first();
					if (duplicateAmundiId) {
						throw new NetworkValidationException("The Amundi ID is already used.");
					}
				}

				if (payload.address && Object.keys(payload.address).length > 0) {
					network.address.useTransaction(transaction);
					await network.address.merge(payload.address).save();
				}

				if (payload.paymentDetails && Object.keys(payload.paymentDetails).length > 0) {
					const paymentDetails = normalizePaymentDetails({
						iban: payload.paymentDetails.iban ?? network.paymentDetails.iban,
						bic: payload.paymentDetails.bic ?? network.paymentDetails.bic,
					});
					network.paymentDetails.useTransaction(transaction);
					await network.paymentDetails.merge(paymentDetails).save();
				}

				const networkChanges: {
					name?: string;
					amundiOrgId?: string | null;
					goCode?: number | null;
				} = {};
				if (Object.hasOwn(payload, "name")) {
					networkChanges.name = payload.name;
				}
				if (Object.hasOwn(payload, "amundiOrgId")) {
					networkChanges.amundiOrgId = payload.amundiOrgId;
				}
				if (Object.hasOwn(payload, "goCode")) {
					networkChanges.goCode = payload.goCode;
				}

				if (Object.keys(networkChanges).length > 0) {
					network.useTransaction(transaction);
					await network.merge(networkChanges).save();
				}

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

function hasModifiableFields(payload: UpdateNetworkPayload) {
	return (
		["name", "amundiOrgId", "goCode"].some((field) => Object.hasOwn(payload, field)) ||
		(payload.address !== undefined && Object.keys(payload.address).length > 0) ||
		(payload.paymentDetails !== undefined && Object.keys(payload.paymentDetails).length > 0)
	);
}

function isUniqueConstraintViolation(error: unknown) {
	return typeof error === "object" && error !== null && "code" in error && error.code === "23505";
}
