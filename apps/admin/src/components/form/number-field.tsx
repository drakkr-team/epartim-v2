import { Field } from "@workspace/ui-react/components/field";
import { NumberInput, type NumberInputProps } from "@workspace/ui-react/components/number-input";

import { useFieldContext } from "#/libs/form";

type NumberFieldProps = {
	label?: string;
	description?: string;
	required?: boolean;
	disabled?: boolean;
	inputProps?: Omit<
		NumberInputProps,
		"id" | "name" | "value" | "disabled" | "onValueCommitted" | "onBlur"
	>;
};

export function NumberField(props: NumberFieldProps) {
	const { label, description, required, disabled, inputProps } = props;

	const field = useFieldContext<number | null>();
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
			<NumberInput
				id={field.name}
				name={field.name}
				value={field.state.value}
				disabled={disabled}
				onValueCommitted={(value) => field.handleChange(value)}
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
