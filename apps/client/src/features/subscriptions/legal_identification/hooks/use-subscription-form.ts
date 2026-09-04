import {
	getLegalIdentificationPatch,
	type LegalIdentificationFieldName,
	type LegalIdentificationFormValues,
} from "#/features/subscriptions/legal_identification/form-values";
import { useUpdateSubscriptionMutation } from "#/features/subscriptions/legal_identification/hooks/use-update-subscription-mutation";
import { useAppForm } from "#/libs/form";

type UseSubscriptionFormParams = {
	subscriptionId: string;
	defaultValues: LegalIdentificationFormValues;
};

export function useSubscriptionForm(params: UseSubscriptionFormParams) {
	const { subscriptionId, defaultValues } = params;
	const { mutateAsync: updateLegalIdentification } = useUpdateSubscriptionMutation(subscriptionId);

	return useAppForm({
		defaultValues,
		listeners: {
			onBlur: ({ fieldApi }) => {
				if (!fieldApi.state.meta.isValid) return;

				const name = fieldApi.name as LegalIdentificationFieldName;
				const legalIdentification = getLegalIdentificationPatch(
					name,
					fieldApi.state.value as LegalIdentificationFormValues[LegalIdentificationFieldName],
				);
				if (!legalIdentification) return;

				void updateLegalIdentification({
					params: { subscriptionId },
					body: { legalIdentification },
				}).catch(() => undefined);
			},
		},
	});
}
