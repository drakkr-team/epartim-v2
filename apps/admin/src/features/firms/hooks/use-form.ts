import { revalidateLogic, useSelector } from "@tanstack/react-form";
import { useBlocker } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import z from "zod";

import { useCreateFirmMutation } from "#/features/firms/hooks/use-create-mutation";
import { useUpdateFirmMutation } from "#/features/firms/hooks/use-update-mutation";
import { useAppForm } from "#/libs/form";
import { convertTuyauErrorToFormErrorMap } from "#/utils/form";

type FirmFormValues = {
	name: string;
	orias: string;
	networkId: number | null;
	address: {
		lineOne: string;
		lineTwo?: string | null;
		zip: string;
		city: string;
		coordinates: {
			latitude: number;
			longitude: number;
		} | null;
	};
	paymentDetail: {
		iban: string;
		bic: string;
	};
};

type UseCreateFirmFormParams = {
	action: "create";
};

type UseUpdateFirmFormParams = {
	action: "update";
	firmId: string | number;
};

export type UseFirmFormParams = {
	defaultValues?: Partial<FirmFormValues>;
} & (UseCreateFirmFormParams | UseUpdateFirmFormParams);

export function useFirmForm(params: UseFirmFormParams) {
	const { t } = useTranslation("features.firms.hooks.use-form");

	const { mutateAsync: createFirm, error: createFirmError } = useCreateFirmMutation();
	const { mutateAsync: updateFirm, error: updateFirmError } = useUpdateFirmMutation();

	const form = useAppForm({
		defaultValues: {
			name: "",
			orias: "",
			networkId: null,
			address: {
				lineOne: "",
				lineTwo: null,
				zip: "",
				city: "",
				coordinates: null,
			},
			paymentDetail: {
				iban: "",
				bic: "",
			},
			...params.defaultValues,
		} as FirmFormValues,
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: z.object({
				name: z
					.string()
					.trim()
					.min(1, t("validation.name.required"))
					.max(254, t("validation.name.max", { max: 254 })),
				orias: z
					.string()
					.trim()
					.min(1, t("validation.orias.required"))
					.max(254, t("validation.orias.max", { max: 254 })),
				networkId: z.number().int().positive().nullable(),
				address: z.object({
					lineOne: z
						.string()
						.trim()
						.min(1, t("validation.address.lineOne.required"))
						.max(254, t("validation.address.lineOne.max", { max: 254 })),
					lineTwo: z
						.string()
						.trim()
						.max(254, t("validation.address.lineTwo.max", { max: 254 }))
						.optional()
						.nullable(),
					zip: z.string().trim().min(1, t("validation.address.zip.required")),
					city: z
						.string()
						.trim()
						.min(1, t("validation.address.city.required"))
						.max(254, t("validation.address.city.max", { max: 254 })),
					coordinates: z
						.object({
							latitude: z.number().min(-90).max(90),
							longitude: z.number().min(-180).max(180),
						})
						.nullable(),
				}),
				paymentDetail: z.object({
					iban: z
						.string()
						.trim()
						.min(1, t("validation.paymentDetail.iban.required"))
						.refine(
							(value) =>
								value.length === 0 ||
								/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(value.replaceAll(" ", "").toUpperCase()),
							t("validation.paymentDetail.iban.iban"),
						),
					bic: z
						.string()
						.trim()
						.min(1, t("validation.paymentDetail.bic.required"))
						.refine(
							(value) =>
								value.length === 0 ||
								/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(value.toUpperCase()),
							t("validation.paymentDetail.bic.format"),
						),
				}),
			}),
		},
		onSubmitInvalid() {
			const invalidInput = document.querySelector<HTMLInputElement>('[aria-invalid="true"]');
			invalidInput?.focus();
		},
		onSubmit: async ({ value }) => {
			if (params.action === "create") {
				await createFirm({ body: value });
			}

			if (params.action === "update") {
				const { name, orias, ...rest } = value;
				await updateFirm({
					params: { firmId: params.firmId },
					body: {
						name: name === params.defaultValues?.name ? undefined : name,
						orias: orias === params.defaultValues?.orias ? undefined : orias,
						...rest,
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
		if (createFirmError?.isValidationError()) {
			errorMap = convertTuyauErrorToFormErrorMap(createFirmError, t);
		}
		if (updateFirmError?.isValidationError()) {
			errorMap = convertTuyauErrorToFormErrorMap(updateFirmError, t);
		}

		if (errorMap) {
			form.setErrorMap({
				onDynamic: {
					fields: errorMap,
				},
			});
		}
	}, [createFirmError, updateFirmError, form, t]);

	return form;
}
