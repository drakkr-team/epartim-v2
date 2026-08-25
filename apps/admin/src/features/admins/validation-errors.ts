import type { AdminFieldErrors } from "#/features/admins/model";

export type AdminMutationOptions = {
	readonly onValidationError?: (errors: AdminFieldErrors) => void;
};

export function validationErrorsByField(
	errors: readonly { readonly field: string; readonly message: string }[],
) {
	const name = errors.find((error) => error.field === "name")?.message;
	const email = errors.find((error) => error.field === "email")?.message;

	return {
		...(name ? { name } : {}),
		...(email ? { email } : {}),
	};
}
