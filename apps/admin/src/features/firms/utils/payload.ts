export type FirmFormValues = {
	name: string;
	amundiOrgId: string;
	orias: string;
	networkId: number | null;
	address: {
		lineOne: string;
		lineTwo: string;
		zip: string;
		city: string;
		coordinates: {
			latitude: number | null;
			longitude: number | null;
		};
	};
	paymentDetail: {
		iban: string;
		bic: string;
	};
};

function getAddressPayload(values: FirmFormValues) {
	const { latitude, longitude } = values.address.coordinates;

	return {
		lineOne: values.address.lineOne.trim(),
		lineTwo: values.address.lineTwo.trim() || null,
		zip: values.address.zip.trim(),
		city: values.address.city.trim(),
		coordinates: latitude !== null && longitude !== null ? { latitude, longitude } : undefined,
	};
}

function getPaymentDetailPayload(values: FirmFormValues) {
	return {
		iban: values.paymentDetail.iban.replaceAll(" ", "").toUpperCase(),
		bic: values.paymentDetail.bic.trim().toUpperCase(),
	};
}

export function getCreateFirmBody(values: FirmFormValues) {
	return {
		name: values.name.trim(),
		amundiOrgId: values.amundiOrgId.trim() || null,
		orias: values.orias.trim(),
		networkId: values.networkId,
		address: getAddressPayload(values),
		paymentDetail: getPaymentDetailPayload(values),
	};
}

export function getUpdateFirmBody(initialValues: FirmFormValues, values: FirmFormValues) {
	const name = values.name.trim();
	const initialName = initialValues.name.trim();
	const amundiOrgId = values.amundiOrgId.trim() || null;
	const initialAmundiOrgId = initialValues.amundiOrgId.trim() || null;
	const orias = values.orias.trim();
	const initialOrias = initialValues.orias.trim();
	const address = getAddressPayload(values);
	const initialAddress = getAddressPayload(initialValues);
	const paymentDetail = getPaymentDetailPayload(values);
	const initialPaymentDetail = getPaymentDetailPayload(initialValues);

	return {
		...(name !== initialName ? { name } : {}),
		...(amundiOrgId !== initialAmundiOrgId ? { amundiOrgId } : {}),
		...(orias !== initialOrias ? { orias } : {}),
		...(values.networkId !== initialValues.networkId ? { networkId: values.networkId } : {}),
		...(JSON.stringify(address) !== JSON.stringify(initialAddress) ? { address } : {}),
		...(JSON.stringify(paymentDetail) !== JSON.stringify(initialPaymentDetail)
			? { paymentDetail }
			: {}),
	};
}
