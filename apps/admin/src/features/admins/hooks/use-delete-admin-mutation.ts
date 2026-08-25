import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { toast } from "@workspace/ui-react/components/toast";

import { api } from "#/libs/tuyau";
import { toastifyTuyauError } from "#/utils/tuyau";

type DeleteMutationOptions = {
	readonly onSuccess?: () => void;
};

export function useDeleteAdminMutation(options: DeleteMutationOptions = {}) {
	const { t } = useTranslation("features.admins");
	const queryClient = useQueryClient();

	return useMutation(
		api.admins.delete.mutationOptions({
			onSuccess: async () => {
				queryClient.removeQueries({ queryKey: api.admins.view.pathKey() });
				await queryClient.invalidateQueries({ queryKey: api.admins.list.pathKey() });
				toast.success(t("delete.success.title"), {
					description: t("delete.success.description"),
				});
				options.onSuccess?.();
			},
			onError: (error) => {
				if (error.isStatus(403)) {
					toast.error(t("errors.forbidden.title"), {
						description: t("errors.forbidden.description"),
					});
					return;
				}
				if (error.isStatus(404)) {
					toast.error(t("errors.notFound.title"), {
						description: t("errors.notFound.description"),
					});
					return;
				}

				toastifyTuyauError(error, {
					E_NETWORK: [t("errors.network.title"), { description: t("errors.network.description") }],
					E_UNAUTHORIZED_ACCESS: [
						t("errors.forbidden.title"),
						{ description: t("errors.forbidden.description") },
					],
					E_ROW_NOT_FOUND: [
						t("errors.notFound.title"),
						{ description: t("errors.notFound.description") },
					],
					E_UNEXPECTED: [
						t("errors.unexpected.title"),
						{ description: t("errors.unexpected.description") },
					],
				});
			},
		}),
	);
}
