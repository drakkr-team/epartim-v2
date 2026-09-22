import { useTranslation } from "react-i18next";
import z from "zod";

import { Button } from "@workspace/ui-react/components/button";
import { Field } from "@workspace/ui-react/components/field";

import {
	KYC_OWNER_KIND,
	type KycOwnerKind,
	type useKycOwnersForm,
} from "#/features/subscriptions/kyc/hooks/use-kyc-owners-form";

const namespace = "features.subscriptions.kyc";

type BeneficialOwnerKindFieldProps = {
	form: ReturnType<typeof useKycOwnersForm>["form"];
	index: number;
	ownerKind: KycOwnerKind;
};

export function BeneficialOwnerKindField(props: BeneficialOwnerKindFieldProps) {
	const { form, index, ownerKind } = props;
	const { t } = useTranslation(namespace);
	const fields = `owners[${index}]` as const;
	const kindSchema = z.literal([KYC_OWNER_KIND.PHYSICAL_PERSON, KYC_OWNER_KIND.LEGAL_ENTITY]);
	const options = [
		{ label: t("kind.physical"), value: KYC_OWNER_KIND.PHYSICAL_PERSON },
		{ label: t("kind.legal"), value: KYC_OWNER_KIND.LEGAL_ENTITY },
	];

	function changeKind(kind: KycOwnerKind) {
		form.setFieldValue(fields, (owner) =>
			kind === KYC_OWNER_KIND.PHYSICAL_PERSON
				? { ...owner, kind, legalName: "" }
				: { ...owner, kind, firstName: "", lastName: "", birthDate: "", birthCity: "" },
		);
	}

	return (
		<form.AppField name={`${fields}.kind`} validators={{ onBlur: kindSchema }}>
			{(field) => (
				<Field name={field.name} className="flex flex-col gap-2">
					<Field.Label required>{t("field.kind")}</Field.Label>
					<div className="flex flex-wrap gap-2">
						{options.map((option) => (
							<Button
								key={option.value}
								type="button"
								variant={ownerKind === option.value ? "secondary" : "default"}
								aria-pressed={ownerKind === option.value}
								onClick={() => {
									field.handleChange(option.value);
									changeKind(option.value);
									field.handleBlur();
								}}
							>
								{option.label}
							</Button>
						))}
					</div>
				</Field>
			)}
		</form.AppField>
	);
}
