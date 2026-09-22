import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { toast } from "@workspace/ui-react/components/toast";

import { api } from "#/libs/tuyau";
import { toastifyTuyauError } from "#/utils/tuyau";

export function useCreateUserMutation() {
	const { t } = useTranslation("features.users.hooks.use-create-mutation");

	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation(
		api.users.create.mutationOptions({
			onSuccess: async (user) => {
				await queryClient.invalidateQueries({ queryKey: api.users.pathKey() });
				toast.success(t("success.title"), {
					description: t("success.description", { name: user.name }),
				});
				navigate({ to: "/users/$userId", params: { userId: user.id.toString() } });
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
