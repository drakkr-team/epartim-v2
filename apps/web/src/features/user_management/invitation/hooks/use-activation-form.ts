import { revalidateLogic } from "@tanstack/react-form";
import { useTranslation } from "react-i18next";
import z from "zod";

import { useActivationMutation } from "#/features/user_management/invitation/hooks/use-activation-mutation";
import { useAppForm } from "#/libs/form";

export function useActivationForm(token: string) {
	const { t } = useTranslation("features.user_management.invitation.hooks.use-activation-form");
	const { mutateAsync: activate } = useActivationMutation();

	const schema = z
		.object({
			password: z
				.string({ error: t("validation.password.required") })
				.min(8, { message: t("validation.password.min") })
				.max(32, { message: t("validation.password.max") }),
			passwordConfirmation: z.string({ error: t("validation.passwordConfirmation.required") }),
		})
		.refine((data) => data.password === data.passwordConfirmation, {
			message: t("validation.passwordConfirmation.mismatch"),
			path: ["passwordConfirmation"],
		});

	return useAppForm({
		defaultValues: { password: "", passwordConfirmation: "" },
		validationLogic: revalidateLogic(),
		validators: { onDynamic: schema },
		onSubmit: async ({ value }) => {
			await activate({ body: { token, password: value.password } });
		},
	});
}
