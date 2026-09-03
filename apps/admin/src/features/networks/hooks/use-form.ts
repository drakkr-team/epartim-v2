import { revalidateLogic, useSelector } from "@tanstack/react-form";
import { useBlocker } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import z from "zod";

import { useCreateNetworkMutation } from "#/features/networks/hooks/use-create-mutation";
import { useUpdateNetworkMutation } from "#/features/networks/hooks/use-update-mutation";
import { useAppForm } from "#/libs/form";
import { convertTuyauErrorToFormErrorMap } from "#/utils/form";

export type NetworkFormValues = {
	name: string;
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

type UseCreateNetworkFormParams = {
	action: "create";
	defaultValues?: Partial<NetworkFormValues>;
};

type UseUpdateNetworkFormParams = {
	action: "update";
	networkId: string | number;
	defaultValues: NetworkFormValues;
};

export type UseNetworkFormParams = UseCreateNetworkFormParams | UseUpdateNetworkFormParams;

export function useNetworkForm(params: UseNetworkFormParams) {
	const { t } = useTranslation("features.networks.hooks.use-form");

	const { mutateAsync: createNetwork, error: createNetworkError } = useCreateNetworkMutation();
	const { mutateAsync: updateNetwork, error: updateNetworkError } = useUpdateNetworkMutation();

	const form = useAppForm({
		defaultValues: {
			name: "",
			address: {
				lineOne: "",
				lineTwo: "",
				zip: "",
				city: "",
				coordinates: null,
			},
			paymentDetail: {
				iban: "",
				bic: "",
			},
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
				await createNetwork({ body: value });
			}

			if (params.action === "update") {
				const { defaultValues } = params;

				await updateNetwork({
					params: { networkId: params.networkId },
					body: {
						...(value.name !== defaultValues.name && { name: value.name }),
						...(JSON.stringify(value.address) !== JSON.stringify(defaultValues.address) && {
							address: value.address,
						}),
						...(JSON.stringify(value.paymentDetail) !==
							JSON.stringify(defaultValues.paymentDetail) && {
							paymentDetail: value.paymentDetail,
						}),
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
		if (createNetworkError?.isValidationError()) {
			errorMap = convertTuyauErrorToFormErrorMap(createNetworkError, t);
		}
		if (updateNetworkError?.isValidationError()) {
			errorMap = convertTuyauErrorToFormErrorMap(updateNetworkError, t);
		}

		if (errorMap) {
			form.setErrorMap({
				onDynamic: {
					fields: errorMap,
				},
			});
		}
	}, [createNetworkError, updateNetworkError, form, t]);

	return form;
}
