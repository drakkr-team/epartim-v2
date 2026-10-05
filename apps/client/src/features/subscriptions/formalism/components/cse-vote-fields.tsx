import { useTranslation } from "react-i18next";
import z from "zod";

import type { useFormalismGroupForm } from "#/features/subscriptions/formalism/hooks/use-group-form";

type CseVoteFieldsProps = { form: ReturnType<typeof useFormalismGroupForm>["form"]; group: number };

export function CseVoteFields({ form, group }: CseVoteFieldsProps) {
	const { t } = useTranslation("features.subscriptions.formalism");
	const votes = z
		.number({ error: t("validation.votes") })
		.int(t("validation.votes"))
		.min(0, t("validation.votes"))
		.max(2147483647, t("validation.votes"));

	return (
		<div className="grid gap-4 sm:grid-cols-3">
			{(["votesFor", "votesAgainst", "votesAbstentions"] as const).map((name) => (
				<form.AppField key={name} name={name} validators={{ onBlur: votes }}>
					{(field) => (
						<field.NumberField
							id={`cse-${group}-${name}`}
							label={t(`field.${name}`)}
							required
							inputProps={{
								min: 0,
								step: 1,
								allowOutOfRange: true,
								locale: "fr-FR",
								format: { maximumFractionDigits: 0 },
							}}
						/>
					)}
				</form.AppField>
			))}
		</div>
	);
}
