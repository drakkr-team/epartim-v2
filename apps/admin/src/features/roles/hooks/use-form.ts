import { revalidateLogic, useSelector } from "@tanstack/react-form";
import { useBlocker } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import z from "zod";

import { AUTHORIZATIONS_OPTIONS } from "@workspace/api/constants/role";
import type { Role } from "@workspace/api/data";

import { useCreateRoleMutation } from "#/features/roles/hooks/use-create-mutation";
import { useUpdateRoleMutation } from "#/features/roles/hooks/use-update-mutation";
import { useAppForm } from "#/libs/form";
import { convertTuyauErrorToFormErrorMap } from "#/utils/form";

export type RoleFormValues = Pick<Role, "name" | "authorizations">;

type UseCreateRoleFormParams = {
	action: "create";
	defaultValues?: Partial<RoleFormValues>;
};

type UseUpdateRoleFormParams = {
	action: "update";
	roleId: string | number;
	defaultValues: RoleFormValues;
};

export type UseRoleFormParams = UseCreateRoleFormParams | UseUpdateRoleFormParams;

export function useRoleForm(params: UseRoleFormParams) {
	const { t } = useTranslation("features.roles.hooks.use-form");

	const { mutateAsync: createRole, error: createRoleError } = useCreateRoleMutation();
	const { mutateAsync: updateRole, error: updateRoleError } = useUpdateRoleMutation();

	const form = useAppForm({
		defaultValues: {
			name: "",
			authorizations: [],
			...params.defaultValues,
		},
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: z.object({
				name: z
					.string()
					.trim()
					.min(1, t("validation.name.required"))
					.max(254, t("validation.name.max", { max: 254 })),
				authorizations: z.array(z.enum(AUTHORIZATIONS_OPTIONS)),
			}),
		},
		onSubmitInvalid() {
			const invalidInput = document.querySelector<HTMLInputElement>('[aria-invalid="true"]');
			invalidInput?.focus();
		},
		onSubmit: async ({ value }) => {
			if (params.action === "create") {
				await createRole({ body: value });
			}

			if (params.action === "update") {
				const { defaultValues } = params;

				const authorizationsChanged =
					value.authorizations.length !== defaultValues.authorizations.length ||
					value.authorizations.some(
						(authorization) => !defaultValues.authorizations.includes(authorization),
					);

				await updateRole({
					params: { roleId: params.roleId },
					body: {
						...(value.name !== defaultValues.name && { name: value.name }),
						...(authorizationsChanged && { authorizations: value.authorizations }),
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
		if (createRoleError?.isValidationError()) {
			errorMap = convertTuyauErrorToFormErrorMap(createRoleError, t);
		}
		if (updateRoleError?.isValidationError()) {
			errorMap = convertTuyauErrorToFormErrorMap(updateRoleError, t);
		}

		if (errorMap) {
			form.setErrorMap({
				onDynamic: {
					fields: errorMap,
				},
			});
		}
	}, [createRoleError, updateRoleError, form, t]);

	return form;
}
