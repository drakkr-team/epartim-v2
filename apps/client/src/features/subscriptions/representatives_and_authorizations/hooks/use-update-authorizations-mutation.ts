import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { api } from "#/libs/tuyau";
import { toastifyTuyauError } from "#/utils/tuyau";

export function useUpdateAuthorizationsMutation(subscriptionId: string) {
	const { t } = useTranslation(
		"features.subscriptions.representatives_and_authorizations.hooks.use-update-mutation",
	);

	return useMutation(
		api.subscriptions.updateAuthorizations.mutationOptions({
			scope: { id: `subscription:${subscriptionId}:authorizations` },
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
