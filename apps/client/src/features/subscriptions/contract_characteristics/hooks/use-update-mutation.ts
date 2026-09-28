import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TuyauError } from "@tuyau/core/client";
import { useTranslation } from "react-i18next";

import { api } from "#/libs/tuyau";
import { toastifyTuyauError } from "#/utils/tuyau";

export function useUpdateContractCharacteristicsMutations(subscriptionId: string) {
	const { t } = useTranslation(
		"features.subscriptions.contract_characteristics.hooks.use-update-mutation",
	);
	const queryClient = useQueryClient();

	const options = {
		scope: { id: `subscription:${subscriptionId}:contract-characteristics` },
		onSuccess: () => queryClient.invalidateQueries({ queryKey: api.subscriptions.view.pathKey() }),
		onError: (error: TuyauError) => {
			toastifyTuyauError(error, {
				E_NETWORK: [t("error.E_NETWORK.title"), { description: t("error.E_NETWORK.description") }],
				E_VALIDATION: [
					t("error.E_VALIDATION.title"),
					{ description: t("error.E_VALIDATION.description") },
				],
				E_UNEXPECTED: [
					t("error.E_UNEXPECTED.title"),
					{ description: t("error.E_UNEXPECTED.description") },
				],
			});
		},
	};

	return {
		updatePlan: useMutation(
			api.subscriptions.updateContractCharacteristicsPlan.mutationOptions(options),
		),
		updateAgreements: useMutation(
			api.subscriptions.updateContractCharacteristicsAgreements.mutationOptions(options),
		),
		updateAdhesions: useMutation(
			api.subscriptions.updateContractCharacteristicsAdhesions.mutationOptions(options),
		),
		updateMatching: useMutation(
			api.subscriptions.updateContractCharacteristicsMatching.mutationOptions({
				...options,
				onError: (error: TuyauError) => {
					if (!error.isValidationError()) options.onError(error);
				},
			}),
		),
	};
}
