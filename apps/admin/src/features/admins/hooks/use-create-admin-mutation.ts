import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { toast } from "@workspace/ui-react/components/toast";

import {
	type AdminMutationOptions,
	validationErrorsByField,
} from "#/features/admins/validation-errors";
import { api } from "#/libs/tuyau";
import { toastifyTuyauError } from "#/utils/tuyau";

export function useCreateAdminMutation(options: AdminMutationOptions = {}) {
	const { t } = useTranslation("features.admins");
	const queryClient = useQueryClient();

	return useMutation(
		api.admins.create.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({ queryKey: api.admins.list.pathKey() });
				toast.success(t("create.success.title"), {
					description: t("create.success.description"),
				});
			},
			onError: (error) => {
				if (error.isValidationError()) {
					options.onValidationError?.(validationErrorsByField(error.response.errors));
				}
				if (error.isStatus(403)) {
					toast.error(t("errors.forbidden.title"), {
						description: t("errors.forbidden.description"),
					});
					return;
				}

				toastifyTuyauError(error, {
					E_NETWORK: [t("errors.network.title"), { description: t("errors.network.description") }],
					E_VALIDATION: [
						t("errors.validation.title"),
						{ description: t("errors.validation.description") },
					],
					E_UNAUTHORIZED_ACCESS: [
						t("errors.forbidden.title"),
						{ description: t("errors.forbidden.description") },
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
