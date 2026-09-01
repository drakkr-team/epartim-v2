import { revalidateLogic, useStore } from "@tanstack/react-form";
import { useBlocker } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import z from "zod";

import { useCreateFirmMutation } from "#/features/firms/hooks/use-create-mutation";
import { useAppForm } from "#/libs/form";
import { convertTuyauErrorToFormErrorMap } from "#/utils/form";

export type FirmFormValues = {
	name: string;
	amundiOrgId: string;
	orias: string;
	networkId: number | null;
	address: {
		lineOne: string;
		lineTwo: string;
		zip: string;
		city: string;
		coordinates: {
			latitude: number | null;
			longitude: number | null;
		};
	};
	paymentDetail: {
		iban: string;
		bic: string;
	};
};

export type UseFirmFormParams = {
	action: "create";
	defaultValues?: FirmFormValues;
};

export function useFirmForm(params: UseFirmFormParams) {
	const { t } = useTranslation("features.firms.hooks.use-form");
	const {
		mutateAsync: createFirm,
		error: createFirmError,
		isPending: isCreatePending,
	} = useCreateFirmMutation();
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
			const coordinates =
				value.address.coordinates.latitude !== null && value.address.coordinates.longitude !== null
					? {
							latitude: value.address.coordinates.latitude,
							longitude: value.address.coordinates.longitude,
						}
					: undefined;

			const firm = await createFirm({
				body: {
					name: value.name.trim(),
					amundiOrgId: value.amundiOrgId.trim() || null,
					orias: value.orias.trim(),
					networkId: value.networkId,
					address: {
						lineOne: value.address.lineOne.trim(),
						lineTwo: value.address.lineTwo.trim() || null,
						zip: value.address.zip.trim(),
						city: value.address.city.trim(),
						...(coordinates ? { coordinates } : {}),
					},
					paymentDetail: {
						iban: value.paymentDetail.iban.replaceAll(" ", "").toUpperCase(),
						bic: value.paymentDetail.bic.trim().toUpperCase(),
					},
				},
			});

			allowNavigationRef.current = true;
			form.reset();
			window.location.assign(`/firms/${firm.id}`);
		},
	});

	const isDirty = useStore(form.store, (state) => state.isDirty);

	useBlocker({
		disabled: !isDirty,
		enableBeforeUnload: isDirty,
		shouldBlockFn: () => !allowNavigationRef.current && !window.confirm(t("leave-confirmation")),
	});

	useEffect(() => {
		const validationError = createFirmError?.isValidationError() ? createFirmError : null;
		if (!validationError) return;

		const errorMap = convertTuyauErrorToFormErrorMap(validationError, t);
		if (!errorMap) return;

		form.setErrorMap({
			onDynamic: {
				fields: errorMap,
			},
		});
	}, [createFirmError, form, t]);

	return {
		form,
		isPending: isCreatePending,
	};
}
