import { useTranslation } from "react-i18next";
import z from "zod";

import type { useKycOwnersForm } from "#/features/subscriptions/kyc/hooks/use-kyc-owners-form";

const namespace = "features.subscriptions.kyc";

type BeneficialOwnerAddressFieldsProps = {
	form: ReturnType<typeof useKycOwnersForm>["form"];
	index: number;
};

export function BeneficialOwnerAddressFields(props: BeneficialOwnerAddressFieldsProps) {
	const { form, index } = props;
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
							onBlur: addressSchema.lineOne,
						}}
					>
						{(field) => <field.TextField label={t("field.lineOne")} required />}
					</form.AppField>
				</div>
				<div className="md:col-span-1">
					<form.AppField
						name={`${fields}.address.zip`}
						validators={{
							onBlur: addressSchema.zip,
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
							onBlur: addressSchema.city,
						}}
					>
						{(field) => <field.TextField label={t("field.city")} required />}
					</form.AppField>
				</div>
			</div>
		</div>
	);
}
