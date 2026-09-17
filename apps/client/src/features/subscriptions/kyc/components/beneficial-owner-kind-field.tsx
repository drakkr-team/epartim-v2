import { useTranslation } from "react-i18next";

import { Button } from "@workspace/ui-react/components/button";
import { Field } from "@workspace/ui-react/components/field";

import {
	KYC_OWNER_KIND,
	type KycOwnerChanges,
	type KycOwnerKind,
	type useKycForm,
} from "#/features/subscriptions/kyc/hooks/use-form";

const namespace = "features.subscriptions.kyc";

type BeneficialOwnerKindFieldProps = {
	form: ReturnType<typeof useKycForm>["form"];
	index: number;
	onUpdate: (changes: KycOwnerChanges) => void;
	ownerKind: KycOwnerKind;
};

export function BeneficialOwnerKindField(props: BeneficialOwnerKindFieldProps) {
	const { form, index, onUpdate, ownerKind } = props;
	const { t } = useTranslation(namespace);
	const fields = `owners[${index}]` as const;
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
		onUpdate({ kind });
	}

	return (
		<Field>
			<Field.Label required>{t("field.kind")}</Field.Label>
			<div className="flex flex-wrap gap-2">
				{options.map((option) => (
					<Button
						key={option.value}
						type="button"
						variant={ownerKind === option.value ? "primary" : "default"}
						aria-pressed={ownerKind === option.value}
						onClick={() => changeKind(option.value)}
					>
						{option.label}
					</Button>
				))}
			</div>
		</Field>
	);
}
