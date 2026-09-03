import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { toast } from "@workspace/ui-react/components/toast";

import { api } from "#/libs/tuyau";
import { toastifyTuyauError } from "#/utils/tuyau";

export function useUpdateFirmMutation() {
	const { t } = useTranslation("features.firms.hooks.use-update-mutation");

	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation(
		api.firms.update.mutationOptions({
			onSuccess: async (firm) => {
				await queryClient.invalidateQueries({ queryKey: api.firms.pathKey() });
				toast.success(t("success.title"), {
					description: t("success.description", { name: firm.name }),
				});
				navigate({ to: "/firms/$firmId", params: { firmId: firm.id.toString() } });
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
					E_UNAUTHORIZED_ACCESS: [
						t("error.E_UNAUTHORIZED_ACCESS.title"),
						{ description: t("error.E_UNAUTHORIZED_ACCESS.description") },
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
