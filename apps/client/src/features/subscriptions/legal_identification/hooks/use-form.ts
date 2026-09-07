import type { Company } from "@workspace/api/data";

import { useUpdateLegalIdentificationMutation } from "#/features/subscriptions/legal_identification/hooks/use-update-mutation";
import { useAppForm } from "#/libs/form";

export const LEGAL_FORMS = [
	1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
] as const;

type LegalForm = (typeof LEGAL_FORMS)[number];

type UpdateLegalIdentificationRequest = Parameters<
	ReturnType<typeof useUpdateLegalIdentificationMutation>["mutate"]
>[0];

type LegalIdentificationChanges = UpdateLegalIdentificationRequest["body"]["legalIdentification"];

export type UseLegalIdentificationFormParams = {
	subscriptionId: string;
	legalIdentification: Company | null;
};

export function useLegalIdentificationForm(params: UseLegalIdentificationFormParams) {
	const { subscriptionId, legalIdentification } = params;
	const { mutate: update } = useUpdateLegalIdentificationMutation(subscriptionId);
	const legalForm = legalIdentification?.legalForm;
	const companyHeadcount = Number(legalIdentification?.companyHeadcount);

	const form = useAppForm({
		defaultValues: {
			siren: legalIdentification?.siren ?? "",
			siret: legalIdentification?.siret ?? "",
			naf: legalIdentification?.naf ?? "",
			name: legalIdentification?.name ?? "",
			legalForm: LEGAL_FORMS.includes(legalForm as LegalForm) ? (legalForm as LegalForm) : null,
			companyHeadcount:
				Number.isInteger(companyHeadcount) && companyHeadcount > 0 ? companyHeadcount : null,
			vatNumber: legalIdentification?.vatNumber ?? "",
			financialYearClosingDay: legalIdentification?.financialYearClosingDay ?? "",
		},
	});

	function updateLegalIdentification(legalIdentification: LegalIdentificationChanges) {
		update({
			params: { subscriptionId },
			body: { legalIdentification },
		});
	}

	return { form, updateLegalIdentification };
}
