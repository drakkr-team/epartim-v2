import { Field } from "@workspace/ui-react/components/field";
import { Input, type InputProps } from "@workspace/ui-react/components/input";

import { useFieldContext } from "#/libs/form";

type TextFieldProps = {
	label?: string;
	description?: string;
	required?: boolean;
	disabled?: boolean;
	inputProps?: Omit<
		InputProps,
		"id" | "name" | "value" | "onChange" | "onBlur" | "aria-invalid" | "disabled"
	>;
};

export function TextField(props: TextFieldProps) {
	const { label, description, required, disabled, inputProps } = props;

	const field = useFieldContext<string>();
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

	return (
		<Field
			name={field.name}
			invalid={isInvalid}
			disabled={disabled}
			className="flex flex-col gap-1"
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
			{isInvalid &&
				field.state.meta.errors.map((error) => (
					<Field.Error key={`${error.code}-${error.path}`}>{error.message}</Field.Error>
				))}
		</Field>
	);
}
