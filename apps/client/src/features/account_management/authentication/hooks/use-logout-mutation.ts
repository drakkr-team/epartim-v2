import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { api } from "#/libs/tuyau";
import { toastifyTuyauError } from "#/utils/tuyau";

export function useLogoutMutation() {
	const { t } = useTranslation(
		"features.account_management.authentication.hooks.use-logout-mutation",
	);

	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation(
		api.accountManagement.authentication.logout.mutationOptions({
			onSuccess: () => {
				queryClient.removeQueries({
					queryKey: api.accountManagement.profile.view.pathKey(),
				});
				navigate({ to: "/login" });
			},
			onError: (error) => {
				const errorCode =
					error.response &&
					typeof error.response === "object" &&
					"code" in error.response &&
					typeof error.response.code === "string"
						? error.response.code
						: undefined;

				if (errorCode === "E_UNAUTHENTICATED") {
					queryClient.removeQueries({
						queryKey: api.accountManagement.profile.view.pathKey(),
					});
					navigate({ to: "/login" });
				}

				toastifyTuyauError(error, {
					E_NETWORK: [
						t("error.E_NETWORK.title"),
						{ description: t("error.E_NETWORK.description") },
					],
					E_UNEXPECTED: [
						t("error.E_UNEXPECTED.title"),
						{ description: t("error.E_UNEXPECTED.description") },
					],
					E_VALIDATION: [
						t("error.E_UNEXPECTED.title"),
						{ description: t("error.E_UNEXPECTED.description") },
					],
					E_UNAUTHENTICATED: [
						t("error.E_UNAUTHENTICATED.title"),
						{ description: t("error.E_UNAUTHENTICATED.description") },
					],
				});
			},
		}),
	);
}
