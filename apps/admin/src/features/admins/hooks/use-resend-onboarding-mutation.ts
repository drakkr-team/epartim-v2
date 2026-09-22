import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { toast } from "@workspace/ui-react/components/toast";

import { api } from "#/libs/tuyau.ts";
import { toastifyTuyauError } from "#/utils/tuyau.ts";

export function useResendOnboardingMutation() {
	const { t } = useTranslation("features.admins.hooks.use-resend-onboarding-mutation");

	return useMutation(
		api.admins.resendOnboarding.mutationOptions({
			onSuccess: () => {
				toast.success(t("success.title"), {
					description: t("success.description"),
				});
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
