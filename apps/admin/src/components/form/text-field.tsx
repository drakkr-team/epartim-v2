import { Field } from "@workspace/ui-react/components/field";
import { Input, type InputProps } from "@workspace/ui-react/components/input";

import { useFieldContext } from "#/libs/form";

type TextFieldProps = {
	label?: string;
	description?: string;
	required?: boolean;
	disabled?: boolean;
	error?: string;
	inputProps?: Omit<
		InputProps,
		"id" | "name" | "value" | "onChange" | "onBlur" | "aria-invalid" | "disabled"
	>;
};

export function TextField(props: TextFieldProps) {
	const { label, description, required, disabled, error, inputProps } = props;

	const field = useFieldContext<string>();
	const hasLocalError = field.state.meta.isTouched && !field.state.meta.isValid;
	const isInvalid = hasLocalError || error !== undefined;

	return (
		<Field
			name={field.name}
			invalid={isInvalid}
			disabled={disabled}
			className="flex flex-col gap-2"
		>
			{label && (
				<Field.Label htmlFor={field.name} required={required}>
					{label}
				</Field.Label>
			)}
			<Input
				id={field.name}
				name={field.name}
				value={field.state.value}
				aria-invalid={isInvalid}
				disabled={disabled}
				onChange={(e) => field.handleChange(e.target.value)}
				onBlur={field.handleBlur}
				{...inputProps}
			/>
			{description && <Field.Description>{description}</Field.Description>}
			{error && <Field.Error>{error}</Field.Error>}
			{hasLocalError &&
				field.state.meta.errors.map((error) => (
					<Field.Error key={`${error.code}-${error.path}`}>{error.message}</Field.Error>
				))}
		</Field>
	);
}
