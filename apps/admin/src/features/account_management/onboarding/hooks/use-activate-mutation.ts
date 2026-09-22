import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { toast } from "@workspace/ui-react/components/toast";

import { api } from "#/libs/tuyau.ts";
import { toastifyTuyauError } from "#/utils/tuyau.ts";

export function useActivateMutation() {
	const { t } = useTranslation(
		"features.account_management.onboarding.hooks.use-activate-mutation",
	);

	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation(
		api.accountManagement.onboarding.activate.mutationOptions({
			onSuccess: () => {
				toast.success(t("success.title"), { description: t("success.description") });
				queryClient.removeQueries({
					queryKey: api.accountManagement.profile.view.pathKey(),
				});
				navigate({ to: "/" });
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
					E_INVALID_TOKEN: [
						t("error.E_INVALID_TOKEN.title"),
						{ description: t("error.E_INVALID_TOKEN.description") },
					],
					E_GUEST_ONLY: [
						t("error.E_GUEST_ONLY.title"),
						{ description: t("error.E_GUEST_ONLY.description") },
					],
					E_TOO_MANY_REQUESTS: [
						t("error.E_TOO_MANY_REQUESTS.title"),
						{ description: t("error.E_TOO_MANY_REQUESTS.description") },
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
