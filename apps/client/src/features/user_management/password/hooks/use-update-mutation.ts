import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { toast } from "@workspace/ui-react/components/toast";

import { api } from "#/libs/tuyau";
import { toastifyTuyauError } from "#/utils/tuyau";

export function useUpdatePasswordMutation() {
	const { t } = useTranslation("features.user_management.password.hooks.use-update-mutation");

	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation(
		api.userManagement.password.update.mutationOptions({
			onSuccess: () => {
				toast.success(t("success.title"), {
					description: t("success.description"),
				});
				queryClient.removeQueries({
					queryKey: api.userManagement.profile.view.pathKey(),
				});
				navigate({ to: "/login" });
			},
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
					E_UNAUTHENTICATED: [
						t("error.E_UNAUTHENTICATED.title"),
						{ description: t("error.E_UNAUTHENTICATED.description") },
					],
					E_INVALID_CREDENTIALS: [
						t("error.E_INVALID_CREDENTIALS.title"),
						{ description: t("error.E_INVALID_CREDENTIALS.description") },
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
