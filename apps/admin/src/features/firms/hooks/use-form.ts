import { revalidateLogic, useStore } from "@tanstack/react-form";
import { useBlocker, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import z from "zod";

import { useCreateFirmMutation } from "#/features/firms/hooks/use-create-mutation";
import { useUpdateFirmMutation } from "#/features/firms/hooks/use-update-mutation";
import {
	type FirmFormValues,
	getCreateFirmBody,
	getUpdateFirmBody,
} from "#/features/firms/utils/payload";
import { useAppForm } from "#/libs/form";
import { convertTuyauErrorToFormErrorMap } from "#/utils/form";

type UseCreateFirmFormParams = {
	action: "create";
	defaultValues?: FirmFormValues;
};

type UseUpdateFirmFormParams = {
	action: "update";
	firmId: string | number;
	defaultValues: FirmFormValues;
};

export type UseFirmFormParams = UseCreateFirmFormParams | UseUpdateFirmFormParams;

export function useFirmForm(params: UseFirmFormParams) {
	const { t } = useTranslation("features.firms.hooks.use-form");
	const {
		mutateAsync: createFirm,
		error: createFirmError,
		isPending: isCreatePending,
	} = useCreateFirmMutation();
	const {
		mutateAsync: updateFirm,
		error: updateFirmError,
		isPending: isUpdatePending,
	} = useUpdateFirmMutation();
	const navigate = useNavigate();
	const allowNavigationRef = useRef(false);

	const form = useAppForm({
		defaultValues: {
			name: "",
			amundiOrgId: "",
			orias: "",
			networkId: null,
			address: {
				lineOne: "",
				lineTwo: "",
				zip: "",
				city: "",
				coordinates: {
					latitude: null,
					longitude: null,
				},
			},
			paymentDetail: {
				iban: "",
				bic: "",
			},
			...params.defaultValues,
		} satisfies FirmFormValues,
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: z.object({
				name: z
					.string()
					.trim()
					.min(1, t("validation.name.required"))
					.max(254, t("validation.name.max", { max: 254 })),
				amundiOrgId: z
					.string()
					.trim()
					.max(254, t("validation.amundiOrgId.max", { max: 254 })),
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
						.max(254, t("validation.address.lineTwo.max", { max: 254 })),
					zip: z.string().trim().min(1, t("validation.address.zip.required")),
					city: z
						.string()
						.trim()
						.min(1, t("validation.address.city.required"))
						.max(254, t("validation.address.city.max", { max: 254 })),
					coordinates: z
						.object({
							latitude: z
								.number()
								.min(-90, t("validation.address.coordinates.latitude.min"))
								.max(90, t("validation.address.coordinates.latitude.max"))
								.nullable(),
							longitude: z
								.number()
								.min(-180, t("validation.address.coordinates.longitude.min"))
								.max(180, t("validation.address.coordinates.longitude.max"))
								.nullable(),
						})
						.superRefine((coordinates, context) => {
							const hasLatitude = coordinates.latitude !== null;
							const hasLongitude = coordinates.longitude !== null;

							if (hasLatitude === hasLongitude) return;

							context.addIssue({
								code: "custom",
								path: [hasLatitude ? "longitude" : "latitude"],
								message: t("validation.address.coordinates.pair"),
							});
						}),
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
				const firm = await createFirm({
					body: getCreateFirmBody(value),
				});

				allowNavigationRef.current = true;
				form.reset();
				await navigate({
					to: "/firms/$firmId",
					params: { firmId: firm.id.toString() },
					search: {},
				});
				return;
			}

			const firm = await updateFirm({
				params: { firmId: params.firmId },
				body: getUpdateFirmBody(params.defaultValues, value),
			});

			allowNavigationRef.current = true;
			form.reset();
			await navigate({
				to: "/firms/$firmId",
				params: { firmId: firm.id.toString() },
				search: {},
			});
		},
	});

	const isDirty = useStore(form.store, (state) => state.isDirty);

	useBlocker({
		disabled: !isDirty,
		enableBeforeUnload: isDirty,
		shouldBlockFn: () => !allowNavigationRef.current && !window.confirm(t("leave-confirmation")),
	});

	useEffect(() => {
		const validationError = createFirmError?.isValidationError()
			? createFirmError
			: updateFirmError?.isValidationError()
				? updateFirmError
				: null;
		if (!validationError) return;

		const errorMap = convertTuyauErrorToFormErrorMap(validationError, t);
		if (!errorMap) return;

		form.setErrorMap({
			onDynamic: {
				fields: errorMap,
			},
		});
	}, [createFirmError, updateFirmError, form, t]);

	return {
		form,
		isPending: params.action === "create" ? isCreatePending : isUpdatePending,
	};
}
