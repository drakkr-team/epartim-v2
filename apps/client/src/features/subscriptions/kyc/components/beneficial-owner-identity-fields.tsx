import { useTranslation } from "react-i18next";
import z from "zod";

import { DatePicker } from "@workspace/ui-react/components/date-picker";
import { Field } from "@workspace/ui-react/components/field";

import {
	KYC_OWNER_KIND,
	type KycOwnerKind,
	type useKycOwnersForm,
} from "#/features/subscriptions/kyc/hooks/use-kyc-owners-form";
import { formatCalendarDate, parseCalendarDate } from "#/utils/helpers/date";

const namespace = "features.subscriptions.kyc";

type BeneficialOwnerIdentityFieldsProps = {
	form: ReturnType<typeof useKycOwnersForm>["form"];
	index: number;
	ownerKind: KycOwnerKind;
};

export function BeneficialOwnerIdentityFields(props: BeneficialOwnerIdentityFieldsProps) {
	const { form, index, ownerKind } = props;
	const { t } = useTranslation(namespace);
	const fields = `owners[${index}]` as const;
	const identitySchema = {
		firstName: z.string().trim().min(1, t("validation.required")).max(100, t("validation.max")),
		lastName: z.string().trim().min(1, t("validation.required")).max(100, t("validation.max")),
		birthDate: z.string().trim().min(1, t("validation.required")),
		birthCity: z.string().trim().min(1, t("validation.required")).max(100, t("validation.max")),
		legalName: z.string().trim().min(1, t("validation.required")).max(254, t("validation.max")),
	};

	if (ownerKind === KYC_OWNER_KIND.PHYSICAL_PERSON) {
		return (
			<div className="grid gap-4 md:grid-cols-2">
				<form.AppField
					name={`${fields}.firstName`}
					validators={{ onBlur: identitySchema.firstName }}
				>
					{(field) => <field.TextField label={t("field.firstName")} required />}
				</form.AppField>
				<form.AppField name={`${fields}.lastName`} validators={{ onBlur: identitySchema.lastName }}>
					{(field) => <field.TextField label={t("field.lastName")} required />}
				</form.AppField>
				<form.AppField
					name={`${fields}.birthDate`}
					validators={{ onBlur: identitySchema.birthDate }}
				>
					{(field) => {
						const invalid =
							field.state.meta.isTouched && field.state.meta.errorMap.onBlur !== undefined;

						return (
							<Field name={field.name} invalid={invalid} className="flex flex-col gap-2">
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
									}}
									placeholder={t("field.birthDate")}
									selected={parseCalendarDate(field.state.value)}
								/>
								{invalid &&
									field.state.meta.errorMap.onBlur?.map((error) => (
										<Field.Error key={error.message}>{error.message}</Field.Error>
									))}
							</Field>
						);
					}}
				</form.AppField>
				<form.AppField
					name={`${fields}.birthCity`}
					validators={{ onBlur: identitySchema.birthCity }}
				>
					{(field) => <field.TextField label={t("field.birthCity")} required />}
				</form.AppField>
			</div>
		);
	}

	return (
		<form.AppField name={`${fields}.legalName`} validators={{ onBlur: identitySchema.legalName }}>
			{(field) => <field.TextField label={t("field.legalName")} required />}
		</form.AppField>
	);
}
