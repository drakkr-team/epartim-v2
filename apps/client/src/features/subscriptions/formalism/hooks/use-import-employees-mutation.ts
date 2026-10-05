import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { api } from "#/libs/tuyau";
import { toastifyTuyauError } from "#/utils/tuyau";

export function useImportFormalismEmployeesMutation(subscriptionId: string) {
	const { t } = useTranslation("features.subscriptions.formalism");
	const queryClient = useQueryClient();

	return useMutation(
		api.subscriptions.importFormalismEmployees.mutationOptions({
			scope: { id: `subscription:${subscriptionId}:formalism` },
			onSuccess: () =>
				queryClient.invalidateQueries({ queryKey: api.subscriptions.view.pathKey() }),
			onError: (error) => {
				toastifyTuyauError(error, {
					E_NETWORK: [t("error.network"), { description: t("error.retry") }],
					E_VALIDATION: [t("error.validation"), { description: t("error.check") }],
					E_UNEXPECTED: [t("error.unexpected"), { description: t("error.retry") }],
				});
			},
		}),
	);
}
