import { revalidateLogic, useSelector } from "@tanstack/react-form";
import { useBlocker } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import z from "zod";

import { useCreateUserMutation } from "#/features/users/hooks/use-create-mutation";
import { useUpdateUserMutation } from "#/features/users/hooks/use-update-mutation";
import { useAppForm } from "#/libs/form";
import { convertTuyauErrorToFormErrorMap } from "#/utils/form";

type UserFormValues = {
	firstName: string;
	lastName: string;
	email: string;
};

type UseCreateUserFormParams = {
	action: "create";
	defaultValues?: Partial<UserFormValues>;
};

type UseUpdateUserFormParams = {
	action: "update";
	userId: string | number;
	defaultValues: UserFormValues;
};

export type UseUserFormParams = UseCreateUserFormParams | UseUpdateUserFormParams;

export function useUserForm(params: UseUserFormParams) {
	const { t } = useTranslation("features.users.hooks.use-form");

	const { mutateAsync: createUser, error: createUserError } = useCreateUserMutation();
	const { mutateAsync: updateUser, error: updateUserError } = useUpdateUserMutation();

	const form = useAppForm({
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			...params.defaultValues,
		},
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: z.object({
				firstName: z
					.string({ error: t("validation.firstName.required") })
					.min(2, { error: t("validation.firstName.min", { min: 2 }) })
					.max(254, { error: t("validation.firstName.max", { max: 254 }) }),
				lastName: z
					.string({ error: t("validation.lastName.required") })
					.min(2, { error: t("validation.lastName.min", { min: 2 }) })
					.max(254, { error: t("validation.lastName.max", { max: 254 }) }),
				email: z
					.email({ error: t("validation.email.email") })
					.max(254, { error: t("validation.email.max", { max: 254 }) }),
			}),
		},
		onSubmitInvalid() {
			const invalidInput = document.querySelector('[aria-invalid="true"]');

			if (invalidInput instanceof HTMLInputElement) {
				invalidInput.focus();
			}
		},
		onSubmit: async ({ value }) => {
			if (params.action === "create") {
				await createUser({ body: value });
			}

			if (params.action === "update") {
				await updateUser({
					params: { userId: params.userId },
					body: {
						firstName: value.firstName,
						lastName: value.lastName,
					},
				});
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
		if (createUserError?.isValidationError()) {
			errorMap = convertTuyauErrorToFormErrorMap(createUserError, t);
		}
		if (updateUserError?.isValidationError()) {
			errorMap = convertTuyauErrorToFormErrorMap(updateUserError, t);
		}

		if (errorMap) {
			form.setErrorMap({
				onDynamic: {
					fields: errorMap,
				},
			});
		}
	}, [createUserError, updateUserError, form, t]);

	return form;
}
