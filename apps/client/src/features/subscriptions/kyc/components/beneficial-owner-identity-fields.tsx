import { useTranslation } from "react-i18next";
import z from "zod";

import { DatePicker } from "@workspace/ui-react/components/date-picker";
import { Field } from "@workspace/ui-react/components/field";

import {
	KYC_OWNER_KIND,
	type KycOwnerChanges,
	type KycOwnerKind,
	type useKycForm,
} from "#/features/subscriptions/kyc/hooks/use-form";
import { formatCalendarDate, parseCalendarDate } from "#/utils/helpers/date";

const namespace = "features.subscriptions.kyc";

type BeneficialOwnerIdentityFieldsProps = {
	form: ReturnType<typeof useKycForm>["form"];
	index: number;
	onUpdate: (changes: KycOwnerChanges) => void;
	ownerKind: KycOwnerKind;
};

export function BeneficialOwnerIdentityFields(props: BeneficialOwnerIdentityFieldsProps) {
	const { form, index, onUpdate, ownerKind } = props;
	const { t } = useTranslation(namespace);
	const fields = `owners[${index}]` as const;
	const requiredText = z.string().trim().min(1, t("validation.required"));

	if (ownerKind === KYC_OWNER_KIND.PHYSICAL_PERSON) {
		return (
			<div className="grid gap-4 md:grid-cols-2">
				<form.AppField
					name={`${fields}.firstName`}
					validators={{ onBlur: requiredText }}
					listeners={{
						onBlur: ({ value, fieldApi }) => {
							if (fieldApi.state.meta.isValid) onUpdate({ firstName: value.trim() || null });
						},
					}}
				>
					{(field) => <field.TextField label={t("field.firstName")} required />}
				</form.AppField>
				<form.AppField
					name={`${fields}.lastName`}
					validators={{ onBlur: requiredText }}
					listeners={{
						onBlur: ({ value, fieldApi }) => {
							if (fieldApi.state.meta.isValid) onUpdate({ lastName: value.trim() || null });
						},
					}}
				>
					{(field) => <field.TextField label={t("field.lastName")} required />}
				</form.AppField>
				<form.AppField name={`${fields}.birthDate`} validators={{ onBlur: requiredText }}>
					{(field) => (
						<Field
							name={field.name}
							invalid={field.state.meta.isTouched && !field.state.meta.isValid}
							className="flex flex-col gap-2"
						>
							<Field.Label required>{t("field.birthDate")}</Field.Label>
							<DatePicker
								clearable
								clearLabel={t("action.clearBirthDate")}
								inputClassName="w-full"
								mode="single"
								onSelect={(date) => {
									const value = formatCalendarDate(date) ?? "";
									field.handleChange(value);
									field.handleBlur();
									onUpdate({ birthDate: value || null });
								}}
								placeholder={t("field.birthDate")}
								selected={parseCalendarDate(field.state.value)}
							/>
						</Field>
					)}
				</form.AppField>
				<form.AppField
					name={`${fields}.birthCity`}
					validators={{ onBlur: requiredText }}
					listeners={{
						onBlur: ({ value, fieldApi }) => {
							if (fieldApi.state.meta.isValid) onUpdate({ birthCity: value.trim() || null });
						},
					}}
				>
					{(field) => <field.TextField label={t("field.birthCity")} required />}
				</form.AppField>
			</div>
		);
	}

	return (
		<form.AppField
			name={`${fields}.legalName`}
			validators={{ onBlur: requiredText }}
			listeners={{
				onBlur: ({ value, fieldApi }) => {
					if (fieldApi.state.meta.isValid) onUpdate({ legalName: value.trim() || null });
				},
			}}
		>
			{(field) => <field.TextField label={t("field.legalName")} required />}
		</form.AppField>
	);
}
