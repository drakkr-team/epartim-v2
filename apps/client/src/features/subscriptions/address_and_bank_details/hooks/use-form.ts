import type { Address, PaymentDetail } from "@workspace/api/data";

import { useUpdateAddressAndBankDetailsMutation } from "#/features/subscriptions/address_and_bank_details/hooks/use-update-mutation";
import { useAppForm } from "#/libs/form";

type UpdateAddressAndBankDetailsRequest = Parameters<
	ReturnType<typeof useUpdateAddressAndBankDetailsMutation>["mutate"]
>[0];

type AddressAndBankDetailsChanges = UpdateAddressAndBankDetailsRequest["body"];

export type UseAddressAndBankDetailsFormParams = {
	subscriptionId: string;
	address: Address | null;
	paymentDetail: PaymentDetail | null;
};

export function useAddressAndBankDetailsForm(params: UseAddressAndBankDetailsFormParams) {
	const { subscriptionId, address, paymentDetail } = params;
	const { mutate: update } = useUpdateAddressAndBankDetailsMutation(subscriptionId);

	function updateAddressAndBankDetails(addressAndBankDetails: AddressAndBankDetailsChanges) {
		update({
			params: { subscriptionId },
			body: addressAndBankDetails,
		});
	}

	const form = useAppForm({
		defaultValues: {
			lineOne: address?.lineOne ?? "",
			lineTwo: address?.lineTwo ?? "",
			zip: address?.zip ?? "",
			city: address?.city ?? "",
			iban: paymentDetail?.iban ?? "",
			bic: paymentDetail?.bic ?? "",
		},
		listeners: {
			onBlur: ({ fieldApi }) => {
				const isPaymentDetail = fieldApi.name === "iban" || fieldApi.name === "bic";
				const value = String(fieldApi.state.value).trim();
				const normalizedValue = isPaymentDetail ? value.toUpperCase() : value;

				if (normalizedValue.length > 0 && !fieldApi.state.meta.isValid) return;

				updateAddressAndBankDetails(
					(isPaymentDetail
						? { paymentDetail: { [fieldApi.name]: normalizedValue || null } }
						: {
								address: { [fieldApi.name]: normalizedValue || null },
							}) as AddressAndBankDetailsChanges,
				);
			},
		},
	});

	return { form };
}
