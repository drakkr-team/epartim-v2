import { useTranslation } from "react-i18next";
import z from "zod";

import { Button } from "@workspace/ui-react/components/button";
import { Field } from "@workspace/ui-react/components/field";
import { NumberInput } from "@workspace/ui-react/components/number-input";

import { CountrySelect } from "#/features/subscriptions/kyc/components/country-select";
import {
	KYC_OWNER_KIND,
	KYC_OWNER_ROLES,
	type KycOwnerChanges,
	type KycOwnerKind,
	type KycOwnerRole,
	type useKycForm,
} from "#/features/subscriptions/kyc/hooks/use-form";

const namespace = "features.subscriptions.kyc";
const roles = [
	{ label: "Dirigeant", value: KYC_OWNER_ROLES[0] },
	{ label: "Bénéficiaire effectif", value: KYC_OWNER_ROLES[1] },
	{ label: "Procuration", value: KYC_OWNER_ROLES[2] },
	{ label: "Actionnaire", value: KYC_OWNER_ROLES[3] },
] as const;

type BeneficialOwnerOwnershipFieldsProps = {
	form: ReturnType<typeof useKycForm>["form"];
	hasShareholder: boolean;
	index: number;
	onUpdate: (changes: KycOwnerChanges) => void;
	ownerKind: KycOwnerKind;
	ownerRoles: KycOwnerRole[];
};

export function BeneficialOwnerOwnershipFields(props: BeneficialOwnerOwnershipFieldsProps) {
	const { form, hasShareholder, index, onUpdate, ownerKind, ownerRoles } = props;
	const { t } = useTranslation(namespace);
	const fields = `owners[${index}]` as const;

	return (
		<>
			<Field>
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
									form.setFieldValue(`${fields}.roles`, next);
									onUpdate({ roles: next });
								}}
							>
								{role.label}
							</Button>
						);
					})}
				</div>
			</Field>
			<div className="grid gap-4 md:grid-cols-2">
				<form.AppField
					name={`${fields}.shareholdingPercentage`}
					validators={{ onBlur: z.number().min(0).max(100).nullable() }}
					listeners={{
						onBlur: ({ value, fieldApi }) => {
							if (fieldApi.state.meta.isValid) onUpdate({ shareholdingPercentage: value });
						},
					}}
				>
					{(field) => (
						<Field
							name={field.name}
							invalid={field.state.meta.isTouched && !field.state.meta.isValid}
							className="flex flex-col gap-2"
						>
							<Field.Label required>{t("field.shareholdingPercentage")}</Field.Label>
							<NumberInput
								value={field.state.value}
								locale="fr-FR"
								min={0}
								max={100}
								step={0.01}
								onValueCommitted={field.handleChange}
								onBlur={field.handleBlur}
							/>
						</Field>
					)}
				</form.AppField>
				<form.AppField
					name={`${fields}.function`}
					validators={{
						onBlur: hasShareholder
							? z.string()
							: z.string().trim().min(1, t("validation.required")),
					}}
					listeners={{
						onBlur: ({ value, fieldApi }) => {
							if (fieldApi.state.meta.isValid) onUpdate({ function: value.trim() || null });
						},
					}}
				>
					{(field) => <field.TextField label={t("field.function")} required={!hasShareholder} />}
				</form.AppField>
				<form.AppField name={`${fields}.nationality`}>
					{(field) => (
						<CountrySelect
							id={field.name}
							label={
								ownerKind === KYC_OWNER_KIND.PHYSICAL_PERSON
									? t("field.nationality")
									: t("field.registrationCountry")
							}
							required
							value={field.state.value}
							onValueChange={(value) => {
								field.handleChange(value);
								onUpdate({ nationality: value });
							}}
						/>
					)}
				</form.AppField>
			</div>
		</>
	);
}
