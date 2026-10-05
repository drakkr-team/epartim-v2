import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TuyauError } from "@tuyau/core/client";
import { useTranslation } from "react-i18next";

import { api } from "#/libs/tuyau";
import { toastifyTuyauError } from "#/utils/tuyau";

export function useFormalismMutations(subscriptionId: string) {
	const { t } = useTranslation("features.subscriptions.formalism");
	const queryClient = useQueryClient();
	const options = {
		scope: { id: `subscription:${subscriptionId}:formalism` },
		onSuccess: () => queryClient.invalidateQueries({ queryKey: api.subscriptions.view.pathKey() }),
		onError: (error: TuyauError) =>
			toastifyTuyauError(error, {
				E_NETWORK: [t("error.network"), { description: t("error.retry") }],
				E_VALIDATION: [t("error.validation"), { description: t("error.check") }],
				E_UNEXPECTED: [t("error.unexpected"), { description: t("error.retry") }],
			}),
	};
	return {
		updateGroup: useMutation(api.subscriptions.updateFormalismGroup.mutationOptions(options)),
		createMember: useMutation(api.subscriptions.createFormalismMember.mutationOptions(options)),
		updateMember: useMutation(api.subscriptions.updateFormalismMember.mutationOptions(options)),
		deleteMember: useMutation(api.subscriptions.deleteFormalismMember.mutationOptions(options)),
		createEmployee: useMutation(api.subscriptions.createFormalismEmployee.mutationOptions(options)),
		updateEmployee: useMutation(api.subscriptions.updateFormalismEmployee.mutationOptions(options)),
		deleteEmployee: useMutation(api.subscriptions.deleteFormalismEmployee.mutationOptions(options)),
		importEmployees: useMutation(
			api.subscriptions.importFormalismEmployees.mutationOptions(options),
		),
	};
}
