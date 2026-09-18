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

	function updateAddressAndBankDetails(
		addressAndBankDetails: AddressAndBankDetailsChanges,
		onSuccess?: () => void,
	) {
		update(
			{
				params: { subscriptionId },
				body: addressAndBankDetails,
			},
			{ onSuccess },
		);
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
				if (!fieldApi.state.meta.isDirty || !fieldApi.state.meta.isValid) return;

				const isPaymentDetail = fieldApi.name === "iban" || fieldApi.name === "bic";
				const savedValue = fieldApi.state.value;
				const value = String(savedValue).trim();
				const normalizedValue = isPaymentDetail ? value.toUpperCase() : value;

				updateAddressAndBankDetails(
					(isPaymentDetail
						? { paymentDetail: { [fieldApi.name]: normalizedValue || null } }
						: {
								address: { [fieldApi.name]: normalizedValue || null },
							}) as AddressAndBankDetailsChanges,
					() => {
						if (Object.is(fieldApi.state.value, savedValue)) {
							fieldApi.setMeta((meta) => ({ ...meta, isDirty: false }));
						}
					},
				);
			},
		},
	});

	return { form };
}
