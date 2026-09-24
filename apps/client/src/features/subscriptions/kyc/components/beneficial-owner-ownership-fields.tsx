import { useTranslation } from "react-i18next";
import z from "zod";

import { Button } from "@workspace/ui-react/components/button";
import { Field } from "@workspace/ui-react/components/field";

import { CountrySelect } from "#/features/subscriptions/kyc/components/country-select";
import {
	KYC_OWNER_KIND,
	KYC_OWNER_ROLES,
	type KycOwnerKind,
	type KycOwnerRole,
	type useKycOwnersForm,
} from "#/features/subscriptions/kyc/hooks/use-kyc-owners-form";

const namespace = "features.subscriptions.kyc";
const roles = [
	{ label: "Dirigeant", value: KYC_OWNER_ROLES[0] },
	{ label: "Bénéficiaire effectif", value: KYC_OWNER_ROLES[1] },
	{ label: "Procuration", value: KYC_OWNER_ROLES[2] },
	{ label: "Actionnaire", value: KYC_OWNER_ROLES[3] },
] as const;

type BeneficialOwnerOwnershipFieldsProps = {
	form: ReturnType<typeof useKycOwnersForm>["form"];
	hasShareholder: boolean;
	index: number;
	ownerKind: KycOwnerKind;
	ownerRoles: KycOwnerRole[];
};

export function BeneficialOwnerOwnershipFields(props: BeneficialOwnerOwnershipFieldsProps) {
	const { form, hasShareholder, index, ownerKind, ownerRoles } = props;
	const { t } = useTranslation(namespace);
	const fields = `owners[${index}]` as const;
	const rolesSchema = z
		.array(z.literal(KYC_OWNER_ROLES, t("validation.required")))
		.min(1, t("validation.required"));
	const shareholdingPercentageSchema = z
		.number({ error: t("validation.percentage") })
		.min(0, t("validation.percentage"))
		.max(100, t("validation.percentage"));
	const functionSchema = hasShareholder
		? z.string().trim().max(254, t("validation.max"))
		: z.string().trim().min(1, t("validation.required")).max(254, t("validation.max"));
	const nationalitySchema = z
		.string()
		.regex(/^[A-Z]{2}$/, t("validation.required"))
		.nullable()
		.refine((value) => value !== null, t("validation.required"));

	return (
		<>
			<form.AppField name={`${fields}.roles`} validators={{ onBlur: rolesSchema }}>
				{(field) => {
					const invalid =
						field.state.meta.isTouched && field.state.meta.errorMap.onBlur !== undefined;

					return (
						<Field name={field.name} invalid={invalid} className="flex flex-col gap-2">
							<Field.Label required>{t("field.roles")}</Field.Label>
							<div className="flex flex-wrap gap-3">
								{roles.map((role) => {
									const selected = ownerRoles.includes(role.value);

									return (
										<Button
											key={role.value}
											type="button"
											variant={selected ? "secondary" : "default"}
											className={`rounded-full px-4${selected ? "" : "text-secondary-11"}`}
											aria-pressed={selected}
											onClick={() => {
												const next = selected
													? ownerRoles.filter((value) => value !== role.value)
													: [...ownerRoles, role.value];
												field.handleChange(next);
												field.handleBlur();
											}}
										>
											{role.label}
										</Button>
									);
								})}
							</div>
							{invalid &&
								field.state.meta.errorMap.onBlur?.map((error) => (
									<Field.Error key={error.message}>{error.message}</Field.Error>
								))}
						</Field>
					);
				}}
			</form.AppField>
			<div className="grid gap-4 md:grid-cols-2">
				<form.AppField
					name={`${fields}.shareholdingPercentage`}
					validators={{
						onBlur: shareholdingPercentageSchema,
					}}
				>
					{(field) => (
						<field.NumberField
							label={t("field.shareholdingPercentage")}
							required
							inputProps={{ locale: "fr-FR", min: 0, max: 100, step: 0.01 }}
						/>
					)}
				</form.AppField>
				<form.AppField name={`${fields}.function`} validators={{ onBlur: functionSchema }}>
					{(field) => <field.TextField label={t("field.function")} required={!hasShareholder} />}
				</form.AppField>
				<form.AppField name={`${fields}.nationality`} validators={{ onBlur: nationalitySchema }}>
					{(field) => {
						const invalid =
							field.state.meta.isTouched && field.state.meta.errorMap.onBlur !== undefined;
						const errorMessages =
							field.state.meta.errorMap.onBlur?.map((error) => error.message) ?? [];

						return (
							<CountrySelect
								id={field.name}
								invalid={invalid}
								label={
									ownerKind === KYC_OWNER_KIND.PHYSICAL_PERSON
										? t("field.nationality")
										: t("field.registrationCountry")
								}
								required
								errorMessages={errorMessages}
								value={field.state.value}
								onValueChange={(value) => {
									field.handleChange(value);
									field.handleBlur();
								}}
							/>
						);
					}}
				</form.AppField>
			</div>
		</>
	);
}
