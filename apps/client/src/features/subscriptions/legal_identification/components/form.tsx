import { useTranslation } from "react-i18next";
import z from "zod";

import type { Company } from "@workspace/api/data";
import { Field } from "@workspace/ui-react/components/field";
import { Select } from "@workspace/ui-react/components/select";

import {
	LEGAL_FORMS,
	useLegalIdentificationForm,
} from "#/features/subscriptions/legal_identification/hooks/use-form";

type LegalIdentificationFormProps = {
	subscriptionId: string;
	legalIdentification: Company | null;
};

export function LegalIdentificationForm(props: LegalIdentificationFormProps) {
	const { subscriptionId, legalIdentification } = props;
	const { t } = useTranslation(
		"features.subscriptions.legal_identification.components.legal-identification-form",
	);
	const { form, updateLegalIdentification } = useLegalIdentificationForm({
		subscriptionId,
		legalIdentification,
	});
	const legalFormOptions = LEGAL_FORMS.map((value) => ({
		value,
		label: t(`legalForm.${value}`),
	}));
	const legalIdentificationSchema = z.object({
		siren: z
			.string()
			.trim()
			.min(1, t("validation.required"))
			.regex(/^\d{9}$/, t("validation.siren")),
		siret: z
			.string()
			.trim()
			.min(1, t("validation.required"))
			.regex(/^\d{14}$/, t("validation.siret")),
		naf: z
			.string()
			.trim()
			.min(1, t("validation.required"))
			.regex(/^\d{4}[A-Z]$/, t("validation.naf")),
		name: z.string().trim().min(1, t("validation.required")).max(254, t("validation.max")),
		legalForm: z
			.literal(LEGAL_FORMS, t("validation.legalForm"))
			.nullable()
			.refine((value) => value !== null, t("validation.legalForm")),
		companyHeadcount: z
			.number({ error: t("validation.companyHeadcount") })
			.int(t("validation.companyHeadcount"))
			.positive(t("validation.companyHeadcount")),
		vatNumber: z
			.string()
			.trim()
			.min(1, t("validation.required"))
			.regex(/^FR\d{2}\d{9}$/, t("validation.vatNumber")),
		financialYearClosingDay: z
			.string()
			.trim()
			.min(1, t("validation.required"))
			.regex(/^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])$/, t("validation.financialYearClosingDay")),
	});

	return (
		<form noValidate className="grid gap-6">
			<section aria-labelledby="legal-identification-heading" className="grid gap-5">
				<div className="border-neutral-4 border-b pb-4">
					<p className="font-bold text-primary-9 text-xs uppercase tracking-widest">
						{t("eyebrow")}
					</p>
					<h2
						id="legal-identification-heading"
						className="mt-2 font-bold text-secondary-12 text-xl"
					>
						{t("title")}
					</h2>
					<p className="mt-1 text-neutral-11 text-sm">{t("description")}</p>
				</div>

				<div className="grid gap-4 md:grid-cols-3">
					<form.AppField
						name="siren"
						validators={{ onBlur: legalIdentificationSchema.shape.siren }}
						listeners={{
							onBlur: ({ value: siren, fieldApi }) => {
								if (siren.trim().length === 0) {
									updateLegalIdentification({ siren: null });
									return;
								}
								if (!fieldApi.state.meta.isValid) return;

								updateLegalIdentification({ siren: siren.trim() });
							},
						}}
					>
						{(field) => (
							<field.TextField
								label={t("field.siren.label")}
								required
								inputProps={{ inputMode: "numeric", maxLength: 9 }}
							/>
						)}
					</form.AppField>

					<form.AppField
						name="siret"
						validators={{ onBlur: legalIdentificationSchema.shape.siret }}
						listeners={{
							onBlur: ({ value: siret, fieldApi }) => {
								if (siret.trim().length === 0) {
									updateLegalIdentification({ siret: null });
									return;
								}
								if (!fieldApi.state.meta.isValid) return;

								updateLegalIdentification({ siret: siret.trim() });
							},
						}}
					>
						{(field) => (
							<field.TextField
								label={t("field.siret.label")}
								required
								inputProps={{ inputMode: "numeric", maxLength: 14 }}
							/>
						)}
					</form.AppField>

					<form.AppField
						name="naf"
						validators={{ onBlur: legalIdentificationSchema.shape.naf }}
						listeners={{
							onBlur: ({ value: naf, fieldApi }) => {
								if (naf.trim().length === 0) {
									updateLegalIdentification({ naf: null });
									return;
								}
								if (!fieldApi.state.meta.isValid) return;

								updateLegalIdentification({ naf: naf.trim() });
							},
						}}
					>
						{(field) => (
							<field.TextField
								label={t("field.naf.label")}
								required
								inputProps={{ autoCapitalize: "characters", maxLength: 5 }}
							/>
						)}
					</form.AppField>

					<form.AppField
						name="vatNumber"
						validators={{ onBlur: legalIdentificationSchema.shape.vatNumber }}
						listeners={{
							onBlur: ({ value: vatNumber, fieldApi }) => {
								if (vatNumber.trim().length === 0) {
									updateLegalIdentification({ vatNumber: null });
									return;
								}
								if (!fieldApi.state.meta.isValid) return;

								updateLegalIdentification({ vatNumber: vatNumber.trim() });
							},
						}}
					>
						{(field) => <field.TextField label={t("field.vatNumber.label")} required />}
					</form.AppField>

					<form.AppField
						name="name"
						validators={{ onBlur: legalIdentificationSchema.shape.name }}
						listeners={{
							onBlur: ({ value: name, fieldApi }) => {
								if (name.trim().length === 0) {
									updateLegalIdentification({ name: null });
									return;
								}
								if (!fieldApi.state.meta.isValid) return;

								updateLegalIdentification({ name: name.trim() });
							},
						}}
					>
						{(field) => (
							<div className="md:col-span-2">
								<field.TextField label={t("field.name.label")} required />
							</div>
						)}
					</form.AppField>

					<form.AppField
						name="legalForm"
						validators={{ onBlur: legalIdentificationSchema.shape.legalForm }}
						listeners={{
							onBlur: ({ value: legalForm, fieldApi }) => {
								if (legalForm === null) {
									updateLegalIdentification({ legalForm: null });
									return;
								}
								if (!fieldApi.state.meta.isValid) return;

								updateLegalIdentification({ legalForm });
							},
						}}
					>
						{(field) => {
							const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

							return (
								<Field name={field.name} invalid={isInvalid} className="flex flex-col gap-2">
									<Field.Label htmlFor={field.name} required>
										{t("field.legalForm.label")}
									</Field.Label>
									<Select
										items={legalFormOptions}
										value={field.state.value}
										onValueChange={(value) => field.handleChange(value)}
										onOpenChange={(open) => {
											if (!open) field.handleBlur();
										}}
									>
										<Select.Input
											id={field.name}
											name={field.name}
											aria-invalid={isInvalid}
											className="w-full"
										>
											<Select.Value placeholder={t("field.legalForm.placeholder")} />
										</Select.Input>
										<Select.Dropdown>
											{legalFormOptions.map((option) => (
												<Select.Option key={option.value} value={option.value} label={option.label}>
													{option.label}
												</Select.Option>
											))}
										</Select.Dropdown>
									</Select>
									{isInvalid &&
										field.state.meta.errors
											.flat()
											.filter((error) => error !== undefined)
											.map((error) => (
												<Field.Error key={error.message}>{error.message}</Field.Error>
											))}
								</Field>
							);
						}}
					</form.AppField>

					<form.AppField
						name="companyHeadcount"
						validators={{ onBlur: legalIdentificationSchema.shape.companyHeadcount }}
						listeners={{
							onBlur: ({ value: companyHeadcount, fieldApi }) => {
								if (companyHeadcount === null) {
									updateLegalIdentification({ companyHeadcount: null });
									return;
								}
								if (!fieldApi.state.meta.isValid) return;

								updateLegalIdentification({ companyHeadcount });
							},
						}}
					>
						{(field) => (
							<field.NumberField
								label={t("field.companyHeadcount.label")}
								required
								inputProps={{ min: 1, step: 1 }}
							/>
						)}
					</form.AppField>

					<form.AppField
						name="financialYearClosingDay"
						validators={{ onBlur: legalIdentificationSchema.shape.financialYearClosingDay }}
						listeners={{
							onBlur: ({ value: financialYearClosingDay, fieldApi }) => {
								if (financialYearClosingDay.trim().length === 0) {
									updateLegalIdentification({ financialYearClosingDay: null });
									return;
								}
								if (!fieldApi.state.meta.isValid) return;

								updateLegalIdentification({
									financialYearClosingDay: financialYearClosingDay.trim(),
								});
							},
						}}
					>
						{(field) => (
							<field.TextField
								label={t("field.financialYearClosingDay.label")}
								required
								inputProps={{ inputMode: "numeric", placeholder: "JJ/MM", maxLength: 5 }}
							/>
						)}
					</form.AppField>
				</div>
			</section>
		</form>
	);
}
