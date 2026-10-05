import { useTranslation } from "react-i18next";
import z from "zod";

import { Button } from "@workspace/ui-react/components/button";
import { Trash2Icon } from "@workspace/ui-react/icons";

import type { useFormalismEmployeesForm } from "#/features/subscriptions/formalism/hooks/use-employees-form";

type EmployeeFieldsProps = {
	form: ReturnType<typeof useFormalismEmployeesForm>["form"];
	employee: ReturnType<
		typeof useFormalismEmployeesForm
	>["form"]["state"]["values"]["employees"][number];
	index: number;
	busy: boolean;
	onRemove: () => void;
};

export function EmployeeFields({ form, employee, index, busy, onRemove }: EmployeeFieldsProps) {
	const { t } = useTranslation("features.subscriptions.formalism");
	const required = z
		.string()
		.trim()
		.min(1, t("validation.required"))
		.max(254, t("validation.length"));
	const email = z.string().trim().email(t("validation.email")).max(254, t("validation.length"));

	return (
		<section
			className="grid gap-4 rounded-md border border-neutral-5 p-4"
			aria-label={t("ratification.employee", { index: index + 1 })}
		>
			<div className="flex items-center justify-between gap-3">
				<h3 className="font-bold text-secondary-12 text-sm">
					{t("ratification.employee", { index: index + 1 })}
				</h3>
				<Button
					type="button"
					variant="ghost"
					size="icon-md"
					disabled={busy}
					aria-label={t("action.removeEmployee", { index: index + 1 })}
					onClick={onRemove}
				>
					<Trash2Icon />
				</Button>
			</div>
			<div className="grid gap-4 sm:grid-cols-2">
				{(["lastName", "firstName", "email"] as const).map((name) => (
					<form.AppField
						key={name}
						name={`employees[${index}].${name}`}
						validators={{ onBlur: name === "email" ? email : required }}
					>
						{(field) => (
							<field.TextField
								id={`employee-${employee.id}-${name}`}
								label={t(`field.${name}`)}
								required
								inputProps={{ type: name === "email" ? "email" : "text" }}
							/>
						)}
					</form.AppField>
				))}
			</div>
		</section>
	);
}
