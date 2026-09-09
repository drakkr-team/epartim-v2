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

	const form = useAppForm({
		defaultValues: {
			lineOne: address?.lineOne ?? "",
			lineTwo: address?.lineTwo ?? "",
			zip: address?.zip ?? "",
			city: address?.city ?? "",
			iban: paymentDetail?.iban ?? "",
			bic: paymentDetail?.bic ?? "",
		},
	});

	function updateAddressAndBankDetails(addressAndBankDetails: AddressAndBankDetailsChanges) {
		update({
			params: { subscriptionId },
			body: addressAndBankDetails,
		});
	}

	return { form, updateAddressAndBankDetails };
}
