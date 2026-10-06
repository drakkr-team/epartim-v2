import { useTranslation } from "react-i18next";
import z from "zod";

import type { useFormalismForm } from "#/features/subscriptions/formalism/hooks/use-form";

type CsePresidentFieldsProps = {
	form: ReturnType<typeof useFormalismForm>["form"];
	group: number;
};

export function CsePresidentFields({ form, group }: CsePresidentFieldsProps) {
	const { t } = useTranslation("features.subscriptions.formalism");
	const required = z
		.string()
		.trim()
		.min(1, t("validation.required"))
		.max(254, t("validation.length"));
	const email = z.string().trim().email(t("validation.email")).max(254, t("validation.length"));
	return (
		<div className="grid gap-5 sm:grid-cols-2">
			{(["presidentLastName", "presidentFirstName", "presidentEmail"] as const).map((name) => (
				<form.AppField
					key={name}
					name={name}
					validators={{ onBlur: name === "presidentEmail" ? email : required }}
				>
					{(field) => (
						<field.TextField
							id={`cse-${group}-${name}`}
							required
							label={t(`field.${name}`)}
							inputProps={{ type: name === "presidentEmail" ? "email" : "text" }}
						/>
					)}
				</form.AppField>
			))}
		</div>
	);
}
