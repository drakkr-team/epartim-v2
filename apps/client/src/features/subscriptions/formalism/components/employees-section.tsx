import { useTranslation } from "react-i18next";

import { Button } from "@workspace/ui-react/components/button";
import { Field } from "@workspace/ui-react/components/field";
import { PlusIcon } from "@workspace/ui-react/icons";

import { EmployeeFields } from "#/features/subscriptions/formalism/components/employee-fields";
import { EmployeesImport } from "#/features/subscriptions/formalism/components/employees-import";
import type { useFormalismEmployeesForm } from "#/features/subscriptions/formalism/hooks/use-employees-form";

type EmployeesSectionProps = ReturnType<typeof useFormalismEmployeesForm> & {
	subscriptionId: string;
	headcount: string | null;
	busy: boolean;
};

export function EmployeesSection({
	form,
	createEmployee,
	deleteEmployee,
	importMutation,
	mergeImportedEmployees,
	subscriptionId,
	headcount,
	busy,
}: EmployeesSectionProps) {
	const { t } = useTranslation("features.subscriptions.formalism");
	function validateEmployees() {
		const values = form.state.values.employees;
		if (values.length === 0) return t("validation.employees");
		const emails = values.map((value) => value.email.trim().toLowerCase()).filter(Boolean);
		if (new Set(emails).size !== emails.length) return t("validation.duplicateEmail");
	}

	return (
		<section className="grid gap-6">
			<div>
				<p className="font-bold text-primary-9 text-xs uppercase tracking-widest">
					{t("ratification.eyebrow")}
				</p>
				<h2 className="mt-2 font-bold text-secondary-12 text-xl">{t("ratification.title")}</h2>
				<p className="mt-2 text-neutral-11 text-sm">{t("ratification.description")}</p>
			</div>

			<EmployeesImport
				subscriptionId={subscriptionId}
				importMutation={importMutation}
				mergeImportedEmployees={mergeImportedEmployees}
				busy={busy}
			/>
			<form.Subscribe selector={(state) => state.values.employees}>
				{(values) => {
					const dependencies = values.map((_, index) => `employees[${index}].email` as const);
					return (
						<form.AppField
							name="employees"
							mode="array"
							validators={{
								onBlur: validateEmployees,
								onChange: validateEmployees,
								onBlurListenTo: dependencies,
								onChangeListenTo: dependencies,
							}}
						>
							{(field) => (
								<>
									{headcount && values.length !== Number(headcount) && (
										<p
											role="status"
											className="rounded-md border border-warning-6 bg-warning-2 p-4 text-sm text-warning-11"
										>
											{t("ratification.headcount", { count: values.length, headcount })}
										</p>
									)}
									{values.map((employee, index) => (
										<EmployeeFields
											key={employee.id}
											form={form}
											employee={employee}
											index={index}
											busy={busy}
											onRemove={() => deleteEmployee(employee.id)}
										/>
									))}
									<Field
										name={field.name}
										invalid={!field.state.meta.isValid}
										aria-invalid={!field.state.meta.isValid}
									>
										{!field.state.meta.isValid && (
											<Field.Error>
												{field.state.meta.errorMap.onBlur ?? field.state.meta.errorMap.onChange}
											</Field.Error>
										)}
									</Field>
									<Button
										type="button"
										variant="default"
										disabled={busy}
										className="w-fit rounded-full"
										onClick={createEmployee}
									>
										<PlusIcon />
										{t("action.addEmployee")}
									</Button>
								</>
							)}
						</form.AppField>
					);
				}}
			</form.Subscribe>
		</section>
	);
}
