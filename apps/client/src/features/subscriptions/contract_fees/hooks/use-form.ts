import type { routes } from "@workspace/api/registry";

import { useUpdateContractFeesMutation } from "#/features/subscriptions/contract_fees/hooks/use-update-mutation";
import { useAppForm } from "#/libs/form";

type Subscription = (typeof routes)["client.subscriptions.view"]["types"]["response"];
type UpdateContractFeesRequest = NonNullable<
	Parameters<ReturnType<typeof useUpdateContractFeesMutation>["mutate"]>[0]
>;

type UseContractFeesFormParams = {
	subscriptionId: string;
	contractFees: Subscription["contractFees"];
};

export function useContractFeesForm({ subscriptionId, contractFees }: UseContractFeesFormParams) {
	const updateMutation = useUpdateContractFeesMutation(subscriptionId);
	const form = useAppForm({
		defaultValues: {
			pricingOffer: contractFees.pricingOffer,
			entryFeePayer: contractFees.entryFeePayer,
			entryFeeRate: contractFees.entryFeeRate,
		},
		listeners: {
			onBlur: ({ fieldApi }) => {
				if (!fieldApi.state.meta.isDirty || !fieldApi.state.meta.isValid) return;

				const rawValue = fieldApi.state.value;
				updateMutation.mutate(
					{
						params: { subscriptionId },
						body: { [fieldApi.name]: rawValue } as UpdateContractFeesRequest["body"],
					},
					{
						onSuccess: () => {
							if (Object.is(fieldApi.state.value, rawValue)) {
								fieldApi.setMeta((meta) => ({ ...meta, isDirty: false }));
							}
						},
					},
				);
			},
		},
	});

	return { form };
}
