import { useTranslation } from "react-i18next";
import z from "zod";

import type { KycOwnerChanges, useKycForm } from "#/features/subscriptions/kyc/hooks/use-form";

const namespace = "features.subscriptions.kyc";

type BeneficialOwnerAddressFieldsProps = {
	form: ReturnType<typeof useKycForm>["form"];
	index: number;
	onUpdate: (changes: KycOwnerChanges) => void;
};

export function BeneficialOwnerAddressFields(props: BeneficialOwnerAddressFieldsProps) {
	const { form, index, onUpdate } = props;
	const { t } = useTranslation(namespace);
	const fields = `owners[${index}]` as const;
	const addressSchema = {
		lineOne: z.string().trim().min(1, t("validation.required")).max(254, t("validation.max")),
		zip: z
			.string()
			.trim()
			.min(1, t("validation.required"))
			.regex(/^\d{5}$/, t("validation.zip")),
		city: z.string().trim().min(1, t("validation.required")).max(254, t("validation.max")),
	};

	return (
		<div className="border-neutral-4 border-t pt-5">
			<p className="mb-4 font-bold text-secondary-12 text-sm">{t("address.title")}</p>
			<div className="grid gap-4 md:grid-cols-6">
				<div className="md:col-span-3">
					<form.AppField
						name={`${fields}.address.lineOne`}
						validators={{
							onMount: addressSchema.lineOne,
							onBlur: addressSchema.lineOne,
						}}
						listeners={{
							onBlur: ({ value, fieldApi }) => {
								if (fieldApi.state.meta.isValid)
									onUpdate({ address: { lineOne: value.trim() || null } });
							},
						}}
					>
						{(field) => <field.TextField label={t("field.lineOne")} required />}
					</form.AppField>
				</div>
				<div className="md:col-span-1">
					<form.AppField
						name={`${fields}.address.zip`}
						validators={{
							onMount: addressSchema.zip,
							onBlur: addressSchema.zip,
						}}
						listeners={{
							onBlur: ({ value, fieldApi }) => {
								if (fieldApi.state.meta.isValid)
									onUpdate({ address: { zip: value.trim() || null } });
							},
						}}
					>
						{(field) => (
							<field.TextField
								label={t("field.zip")}
								required
								inputProps={{ inputMode: "numeric", maxLength: 5 }}
							/>
						)}
					</form.AppField>
				</div>
				<div className="md:col-span-2">
					<form.AppField
						name={`${fields}.address.city`}
						validators={{
							onMount: addressSchema.city,
							onBlur: addressSchema.city,
						}}
						listeners={{
							onBlur: ({ value, fieldApi }) => {
								if (fieldApi.state.meta.isValid)
									onUpdate({ address: { city: value.trim() || null } });
							},
						}}
					>
						{(field) => <field.TextField label={t("field.city")} required />}
					</form.AppField>
				</div>
			</div>
		</div>
	);
}
