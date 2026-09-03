import type { ReactNode } from "react";

import { Field } from "@workspace/ui-react/components/field";

import { useFieldContext } from "#/libs/form.ts";

export type GenericFieldProps = {
	label?: string;
	description?: string;
	required?: boolean;
	children?: ReactNode;
};

export function GenericField(props: GenericFieldProps) {
	const { label, description, required, children } = props;

	const field = useFieldContext();
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

	return (
		<Field name={field.name} invalid={isInvalid} className="grid gap-1">
			{label && <Field.Label required={required}>{label}</Field.Label>}
			{children}
			{description && <Field.Description>{description}</Field.Description>}
			{isInvalid &&
				field.state.meta.errors.map((error) => {
					return <Field.Error key={`${error.code}-${error.path}`}>{error.message}</Field.Error>;
				})}
		</Field>
	);
}
