import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { api } from "#/libs/tuyau";
import { toastifyTuyauError } from "#/utils/tuyau";

export function useUpdateSubscriptionMutation(subscriptionId: string) {
	const { t } = useTranslation(
		"features.subscriptions.legal_identification.hooks.use-update-subscription-mutation",
	);

	return useMutation(
		api.subscriptions.updateLegalIdentification.mutationOptions({
			scope: { id: `subscription:${subscriptionId}:legal-identification` },
			onError: (error) => {
				toastifyTuyauError(error, {
					E_NETWORK: [
						t("error.E_NETWORK.title"),
						{ description: t("error.E_NETWORK.description") },
					],
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
		}),
	);
}
