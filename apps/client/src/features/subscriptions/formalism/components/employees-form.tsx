import { useIsMutating } from "@tanstack/react-query";

import { Card } from "@workspace/ui-react/components/card";

import { EmployeesSection } from "#/features/subscriptions/formalism/components/employees-section";
import { useFormalismEmployeesForm } from "#/features/subscriptions/formalism/hooks/use-employees-form";
import type { Formalism } from "#/features/subscriptions/formalism/hooks/use-form";
import { useRegisterSubscriptionStepForm } from "#/features/subscriptions/steps/step-validation-context";

type FormalismEmployeesFormProps = {
	subscriptionId: string;
	employees: Formalism["employees"];
	headcount: string | null;
};

export function FormalismEmployeesForm({
	subscriptionId,
	employees,
	headcount,
}: FormalismEmployeesFormProps) {
	const { form, createEmployee, deleteEmployee, importMutation, mergeImportedEmployees } =
		useFormalismEmployeesForm(subscriptionId, employees);
	useRegisterSubscriptionStepForm(form);
	const busy =
		useIsMutating({
			predicate: (mutation) =>
				mutation.options.scope?.id === `subscription:${subscriptionId}:formalism`,
		}) > 0;

	return (
		<Card
			render={<form noValidate onSubmit={(event) => event.preventDefault()} />}
			className="p-6 sm:p-8"
		>
			<EmployeesSection
				form={form}
				createEmployee={createEmployee}
				deleteEmployee={deleteEmployee}
				importMutation={importMutation}
				mergeImportedEmployees={mergeImportedEmployees}
				subscriptionId={subscriptionId}
				headcount={headcount}
				busy={busy}
			/>
		</Card>
	);
}
