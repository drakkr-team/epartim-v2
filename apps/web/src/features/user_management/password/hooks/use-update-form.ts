import { revalidateLogic } from "@tanstack/react-form";
import { useTranslation } from "react-i18next";
import z from "zod";

import { useUpdatePasswordMutation } from "#/features/user_management/password/hooks/use-update-mutation";
import { useAppForm } from "#/libs/form";

export type UseUpdatePasswordFormParams = {
	defaultValues?: {
		currentPassword?: string;
		newPassword?: string;
		confirmNewPassword?: string;
	};
};

export function useUpdatePasswordForm(params?: UseUpdatePasswordFormParams) {
	const { defaultValues } = params ?? {};

	const { t } = useTranslation("features.user_management.password.hooks.use-update-form");

	const { mutateAsync: updatePassword } = useUpdatePasswordMutation();

	const schema = z
		.object({
			currentPassword: z
				.string({ error: t("validation.currentPassword.required") })
				.min(1, { error: t("validation.currentPassword.required") }),
			newPassword: z
				.string({ error: t("validation.newPassword.required") })
				.min(8, { error: t("validation.newPassword.min", { min: 8 }) })
				.max(32, { error: t("validation.newPassword.max", { max: 32 }) }),
			confirmNewPassword: z.string({ error: t("validation.confirmNewPassword.required") }),
		})
		.refine((data) => data.newPassword === data.confirmNewPassword, {
			message: t("validation.confirmNewPassword.mismatch"),
			path: ["confirmNewPassword"],
		});

	return useAppForm({
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmNewPassword: "",
			...defaultValues,
		},
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: schema,
		},
		onSubmit: async ({ value }) => {
			await updatePassword({ body: value });
		},
	});
}
