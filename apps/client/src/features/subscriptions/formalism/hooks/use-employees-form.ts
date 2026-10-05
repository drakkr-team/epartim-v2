import { useCreateFormalismEmployeeMutation } from "#/features/subscriptions/formalism/hooks/use-create-employee-mutation";
import { useDeleteFormalismEmployeeMutation } from "#/features/subscriptions/formalism/hooks/use-delete-employee-mutation";
import type { Formalism } from "#/features/subscriptions/formalism/hooks/use-form";
import { useImportFormalismEmployeesMutation } from "#/features/subscriptions/formalism/hooks/use-import-employees-mutation";
import { useUpdateFormalismEmployeeMutation } from "#/features/subscriptions/formalism/hooks/use-update-employee-mutation";
import { useAppForm } from "#/libs/form";

function employeeValues(employee: Formalism["employees"][number]) {
	return {
		...employee,
		firstName: employee.firstName ?? "",
		lastName: employee.lastName ?? "",
		email: employee.email ?? "",
	};
}
export function useFormalismEmployeesForm(
	subscriptionId: string,
	employees: Formalism["employees"],
) {
	const createEmployeeMutation = useCreateFormalismEmployeeMutation(subscriptionId);
	const updateEmployeeMutation = useUpdateFormalismEmployeeMutation(subscriptionId);
	const deleteEmployeeMutation = useDeleteFormalismEmployeeMutation(subscriptionId);
	const importEmployeesMutation = useImportFormalismEmployeesMutation(subscriptionId);
	type EmployeeBody = NonNullable<Parameters<typeof updateEmployeeMutation.mutate>[0]>["body"];
	const form = useAppForm({
		defaultValues: { employees: employees.map(employeeValues) },
		listeners: {
			onBlur: ({ fieldApi, formApi }) => {
				if (!fieldApi.state.meta.isDirty || !fieldApi.state.meta.isValid) return;
				const match = fieldApi.name.match(/^employees\[(\d+)\]\.(.+)$/);
				if (!match) return;
				const employee = formApi.state.values.employees[Number(match[1])];
				if (!employee) return;
				const rawValue = fieldApi.state.value;
				const value = typeof rawValue === "string" ? rawValue.trim() || null : rawValue;
				updateEmployeeMutation.mutate(
					{
						params: { subscriptionId, employeeId: String(employee.id) },
						body: { [match[2]]: value } as EmployeeBody,
					},
					{
						onSuccess: () => {
							if (Object.is(fieldApi.state.value, rawValue))
								fieldApi.setMeta((meta) => ({ ...meta, isDirty: false }));
						},
					},
				);
			},
		},
	});
	function createEmployee() {
		createEmployeeMutation.mutate(
			{ params: { subscriptionId } },
			{
				onSuccess: (employee) =>
					form.setFieldValue("employees", (current) => [...current, employeeValues(employee)]),
			},
		);
	}
	function deleteEmployee(employeeId: number) {
		deleteEmployeeMutation.mutate(
			{ params: { subscriptionId, employeeId: String(employeeId) } },
			{
				onSuccess: () =>
					form.setFieldValue("employees", (current) =>
						current.filter((employee) => employee.id !== employeeId),
					),
			},
		);
	}
	function mergeImportedEmployees(imported: Formalism["employees"]) {
		form.setFieldValue("employees", (current) => [
			...current,
			...imported
				.filter((employee) => !current.some((item) => item.id === employee.id))
				.map(employeeValues),
		]);
	}
	return {
		form,
		createEmployee,
		deleteEmployee,
		mergeImportedEmployees,
		importMutation: importEmployeesMutation,
	};
}
