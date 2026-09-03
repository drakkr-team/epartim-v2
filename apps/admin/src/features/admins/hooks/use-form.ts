import { revalidateLogic, useSelector } from "@tanstack/react-form";
import { useBlocker } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import z from "zod";

import { useCreateAdminMutation } from "#/features/admins/hooks/use-create-mutation";
import { useUpdateAdminMutation } from "#/features/admins/hooks/use-update-mutation";
import { useAppForm } from "#/libs/form";
import { convertTuyauErrorToFormErrorMap } from "#/utils/form";

type UseCreateAdminFormParams = {
	action: "create";
};

type UseUpdateAdminFormParams = {
	action: "update";
	adminId: string | number;
};

export type UseAdminFormParams = {
	defaultValues?: {
		name?: string;
		email?: string;
	};
} & (UseCreateAdminFormParams | UseUpdateAdminFormParams);

export function useAdminForm(params: UseAdminFormParams) {
	const { t } = useTranslation("features.admins.hooks.use-form");

	const { mutateAsync: createAdmin, error: createAdminError } = useCreateAdminMutation();
	const { mutateAsync: updateAdmin, error: updateAdminError } = useUpdateAdminMutation();

	const form = useAppForm({
		defaultValues: {
			name: "",
			email: "",
			...params.defaultValues,
		},
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: z.object({
				name: z
					.string({ error: t("validation.name.required") })
					.min(1, { error: t("validation.name.required") })
					.max(254, { error: t("validation.name.max", { max: 254 }) }),
				email: z
					.email({ error: t("validation.email.email") })
					.max(254, { error: t("validation.email.max", { max: 254 }) }),
			}),
		},
		onSubmitInvalid() {
			const InvalidInput = document.querySelector('[aria-invalid="true"]') as HTMLInputElement;

			InvalidInput?.focus();
		},
		onSubmit: async ({ value }) => {
			if (params.action === "create") {
				await createAdmin({ body: value });
			}

			if (params.action === "update") {
				await updateAdmin({ params: { adminId: params.adminId }, body: value });
			}
		},
	});

	const shouldBlockNavigation = useSelector(
		form.store,
		(state) => state.isDirty && !state.isSubmitting,
	);

	useBlocker({
		disabled: !shouldBlockNavigation,
		enableBeforeUnload: shouldBlockNavigation,
		shouldBlockFn: () => !window.confirm(t("leave-confirmation")),
	});

	useEffect(() => {
		let errorMap = null;
		if (createAdminError?.isValidationError()) {
			errorMap = convertTuyauErrorToFormErrorMap(createAdminError, t);
		}
		if (updateAdminError?.isValidationError()) {
			errorMap = convertTuyauErrorToFormErrorMap(updateAdminError, t);
		}

		if (errorMap) {
			form.setErrorMap({
				onDynamic: {
					fields: errorMap,
				},
			});
		}
	}, [createAdminError, updateAdminError, form, t]);

	return form;
}
