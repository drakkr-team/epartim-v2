import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { toast } from "@workspace/ui-react/components/toast";

import { api } from "#/libs/tuyau";
import { toastifyTuyauError } from "#/utils/tuyau";

export function useActivationMutation() {
	const { t } = useTranslation("features.user_management.invitation.hooks.use-activation-mutation");
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation(
		api.admin.acceptInvitation.mutationOptions({
			onSuccess: () => {
				queryClient.removeQueries({ queryKey: api.userManagement.profile.view.pathKey() });
				toast.success(t("success.title"), { description: t("success.description") });
				navigate({ to: "/client-portfolio" });
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
					E_INVALID_USER_STATE: [
						t("error.E_INVALID_TOKEN.title"),
						{ description: t("error.E_INVALID_TOKEN.description") },
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
