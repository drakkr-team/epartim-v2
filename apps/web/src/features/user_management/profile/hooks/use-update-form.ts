import { revalidateLogic } from "@tanstack/react-form";
import { useTranslation } from "react-i18next";
import z from "zod";

import { useUpdateProfileMutation } from "#/features/user_management/profile/hooks/use-update-mutation";
import { useAppForm } from "#/libs/form";

export type UseUpdateProfileFormParams = {
	defaultValues?: {
		name?: string;
	};
};

export function useUpdateProfileForm(params?: UseUpdateProfileFormParams) {
	const { defaultValues } = params ?? {};

	const { t } = useTranslation("features.user_management.profile.hooks.use-update-form");

	const { mutateAsync: updateProfile } = useUpdateProfileMutation();

	const schema = z.object({
		name: z
			.string({ error: t("validation.name.required") })
			.min(2, { error: t("validation.name.min", { min: 2 }) })
			.max(254, { error: t("validation.name.max", { max: 254 }) }),
	});

	return useAppForm({
		defaultValues: {
			name: "",
			...defaultValues,
		},
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: schema,
		},
		onSubmit: async ({ value }) => {
			await updateProfile({
				body: value,
			});
		},
	});
}
