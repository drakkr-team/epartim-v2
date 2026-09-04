import { useTranslation } from "react-i18next";
import z from "zod";

import { Field } from "@workspace/ui-react/components/field";
import { Select } from "@workspace/ui-react/components/select";

import {
	LEGAL_FORMS,
	type SubscriptionFormValues,
	useSubscriptionForm,
} from "#/features/subscriptions/legal_identification/hooks/use-subscription-form";

type LegalIdentificationFormProps = {
	subscriptionId: string;
	defaultValues: SubscriptionFormValues;
};

export function LegalIdentificationForm(props: LegalIdentificationFormProps) {
	const { subscriptionId, defaultValues } = props;
	const { t } = useTranslation(
		"features.subscriptions.legal_identification.components.legal-identification-form",
	);
	const form = useSubscriptionForm({ subscriptionId, defaultValues });
	const legalFormOptions = LEGAL_FORMS.map((value) => ({
		value,
		label: t(`legalForm.${value}`),
	}));
	const legalIdentificationSchema = z.object({
		siren: z
			.string()
			.trim()
			.regex(/^\d{9}$/, t("validation.siren")),
		siret: z.union([
			z.literal(""),
			z
				.string()
				.trim()
				.regex(/^\d{14}$/, t("validation.siret")),
		]),
		naf: z
			.string()
			.trim()
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
		vatNumber: z.union([
			z.literal(""),
			z
				.string()
				.trim()
				.regex(/^FR\d{2}\d{9}$/, t("validation.vatNumber")),
		]),
		financialYearClosingDay: z
			.string()
			.trim()
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

				<div className="grid gap-4 md:grid-cols-2">
					<form.AppField
						name="siren"
						validators={{ onBlur: legalIdentificationSchema.shape.siren }}
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
					>
						{(field) => (
							<field.TextField
								label={t("field.siret.label")}
								inputProps={{ inputMode: "numeric", maxLength: 14 }}
							/>
						)}
					</form.AppField>

					<form.AppField name="naf" validators={{ onBlur: legalIdentificationSchema.shape.naf }}>
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
					>
						{(field) => <field.TextField label={t("field.vatNumber.label")} />}
					</form.AppField>

					<form.AppField name="name" validators={{ onBlur: legalIdentificationSchema.shape.name }}>
						{(field) => <field.TextField label={t("field.name.label")} required />}
					</form.AppField>

					<form.AppField
						name="legalForm"
						validators={{ onBlur: legalIdentificationSchema.shape.legalForm }}
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
										<Select.Input id={field.name} name={field.name} aria-invalid={isInvalid}>
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
					>
						{(field) => (
							<field.TextField
								label={t("field.financialYearClosingDay.label")}
								description={t("field.financialYearClosingDay.description")}
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
