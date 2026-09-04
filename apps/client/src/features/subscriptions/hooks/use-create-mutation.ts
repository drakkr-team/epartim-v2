import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { api } from "#/libs/tuyau";
import { toastifyTuyauError } from "#/utils/tuyau";

export function useCreateSubscriptionMutation() {
	const { t } = useTranslation("features.subscriptions.hooks.use-create-mutation");
	const navigate = useNavigate();

	return useMutation(
		api.subscriptions.create.mutationOptions({
			onSuccess: (subscription) =>
				navigate({
					to: "/subscriptions/$id",
					params: { id: String(subscription.id) },
				}),
			onError: (error) => {
				toastifyTuyauError(error, {
					E_NETWORK: [
						t("error.E_NETWORK.title"),
						{ description: t("error.E_NETWORK.description") },
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
