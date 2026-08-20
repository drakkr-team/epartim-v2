import { revalidateLogic } from "@tanstack/react-form";
import { useTranslation } from "react-i18next";
import z from "zod";

import { useResetPasswordMutation } from "#/features/user_management/password/hooks/use-reset-mutation";
import { useAppForm } from "#/libs/form";

export type UseResetPasswordFormParams = {
	token: string;
	defaultValues?: {
		newPassword?: string;
		newPasswordConfirmation?: string;
	};
};

export function useResetPasswordForm(params: UseResetPasswordFormParams) {
	const { t } = useTranslation("features.user_management.password.hooks.use-reset-form");

	const { token, defaultValues } = params;

	const { mutateAsync: resetPassword } = useResetPasswordMutation();

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
			...defaultValues,
		},
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: schema,
		},
		onSubmit: async ({ value }) => {
			await resetPassword({ body: { token, ...value } });
		},
	});
}
