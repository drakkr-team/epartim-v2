import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { toast } from "@workspace/ui-react/components/toast";

import { api } from "#/libs/tuyau";
import { toastifyTuyauError } from "#/utils/tuyau";

export function useDeleteFirmMutation(firmName: string) {
	const { t } = useTranslation("features.firms.hooks.use-delete-mutation");
	const queryClient = useQueryClient();

	return useMutation(
		api.firms.delete.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: api.firms.pathKey(),
					refetchType: "none",
				});
				toast.success(t("success.title"), {
					description: t("success.description", { name: firmName }),
				});
			},
			onError: (error) => {
				toastifyTuyauError(error, {
					E_NETWORK: [
						t("error.E_NETWORK.title"),
						{ description: t("error.E_NETWORK.description") },
					],
					E_ROW_NOT_FOUND: [
						t("error.E_ROW_NOT_FOUND.title"),
						{ description: t("error.E_ROW_NOT_FOUND.description") },
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
