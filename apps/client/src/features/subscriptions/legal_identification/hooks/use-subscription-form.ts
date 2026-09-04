import type { Company } from "@workspace/api/data";

import { useUpdateSubscriptionMutation } from "#/features/subscriptions/legal_identification/hooks/use-update-subscription-mutation";
import { useAppForm } from "#/libs/form";

export const LEGAL_FORMS = [
	1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
] as const;

type LegalForm = (typeof LEGAL_FORMS)[number];

export type SubscriptionFormValues = {
	siren: string;
	siret: string;
	naf: string;
	name: string;
	legalForm: LegalForm | null;
	companyHeadcount: number | null;
	vatNumber: string;
	financialYearClosingDay: string;
};

type LegalIdentification = Pick<
	Company,
	| "siren"
	| "siret"
	| "naf"
	| "name"
	| "legalForm"
	| "companyHeadcount"
	| "vatNumber"
	| "financialYearClosingDay"
>;

type LegalIdentificationPatch = {
	siren?: string;
	siret?: string | null;
	naf?: string;
	name?: string;
	legalForm?: LegalForm;
	companyHeadcount?: number;
	vatNumber?: string | null;
	financialYearClosingDay?: string;
};

type UseSubscriptionFormParams = {
	subscriptionId: string;
	defaultValues: SubscriptionFormValues;
};

export function getSubscriptionFormValues(
	legalIdentification: LegalIdentification | null,
): SubscriptionFormValues {
	const companyHeadcount = Number(legalIdentification?.companyHeadcount);
	const legalForm = legalIdentification?.legalForm;

	return {
		siren: legalIdentification?.siren ?? "",
		siret: legalIdentification?.siret ?? "",
		naf: legalIdentification?.naf ?? "",
		name: legalIdentification?.name ?? "",
		legalForm: LEGAL_FORMS.includes(legalForm as LegalForm) ? (legalForm as LegalForm) : null,
		companyHeadcount:
			Number.isInteger(companyHeadcount) && companyHeadcount > 0 ? companyHeadcount : null,
		vatNumber: legalIdentification?.vatNumber ?? "",
		financialYearClosingDay: legalIdentification?.financialYearClosingDay ?? "",
	};
}

export function useSubscriptionForm(params: UseSubscriptionFormParams) {
	const { subscriptionId, defaultValues } = params;
	const { mutateAsync: updateLegalIdentification } = useUpdateSubscriptionMutation(subscriptionId);

	return useAppForm({
		defaultValues,
		listeners: {
			onBlur: ({ fieldApi }) => {
				if (!fieldApi.state.meta.isValid) return;

				const legalIdentification = getLegalIdentificationPatch(
					fieldApi.name as keyof SubscriptionFormValues,
					fieldApi.state.value as SubscriptionFormValues[keyof SubscriptionFormValues],
				);
				if (!legalIdentification) return;

				void updateLegalIdentification({
					params: { subscriptionId },
					body: { legalIdentification },
				}).catch(() => undefined);
			},
		},
	});
}

function getLegalIdentificationPatch(
	name: keyof SubscriptionFormValues,
	value: SubscriptionFormValues[keyof SubscriptionFormValues],
): LegalIdentificationPatch | null {
	if (value === null) return null;

	return {
		[name]: name === "siret" || name === "vatNumber" ? (value === "" ? null : value) : value,
	} as LegalIdentificationPatch;
}
