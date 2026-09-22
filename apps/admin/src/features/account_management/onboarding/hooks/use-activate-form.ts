import { revalidateLogic } from "@tanstack/react-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { useActivateMutation } from "#/features/account_management/onboarding/hooks/use-activate-mutation.ts";
import { useAppForm } from "#/libs/form.ts";
import { focusFirstInvalidInput } from "#/utils/form.ts";

type ActivateFormValues = {
	newPassword: string;
	newPasswordConfirmation: string;
};

export type UseActivateFormParams = {
	token: string;
	defaultValues?: Partial<ActivateFormValues>;
};

export function useActivateForm(params: UseActivateFormParams) {
	const { t } = useTranslation("features.account_management.onboarding.hooks.use-activate-form");

	const { mutateAsync: activate } = useActivateMutation();

	const schema = z
		.object({
			newPassword: z
				.string({ error: t("validation.newPassword.required") })
				.min(8, { message: t("validation.newPassword.min") })
				.max(32, { message: t("validation.newPassword.max") }),
			newPasswordConfirmation: z.string({
				error: t("validation.newPasswordConfirmation.required"),
			}),
		})
		.refine((data) => data.newPassword === data.newPasswordConfirmation, {
			message: t("validation.newPasswordConfirmation.mismatch"),
			path: ["newPasswordConfirmation"],
		});

	return useAppForm({
		defaultValues: {
			newPassword: "",
			newPasswordConfirmation: "",
			...params.defaultValues,
		} as ActivateFormValues,
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: schema,
		},
		onSubmitInvalid: focusFirstInvalidInput,
		onSubmit: async ({ value }) => {
			await activate({
				body: {
					...value,
					token: params.token,
				},
			});
		},
	});
}
