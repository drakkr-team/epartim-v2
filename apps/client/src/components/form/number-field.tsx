import { Field } from "@workspace/ui-react/components/field";
import { NumberInput, type NumberInputProps } from "@workspace/ui-react/components/number-input";

import { useFieldContext } from "#/libs/form";

type NumberFieldProps = {
	label?: string;
	description?: string;
	required?: boolean;
	disabled?: boolean;
	externalError?: string;
	inputProps?: Omit<
		NumberInputProps,
		"id" | "name" | "value" | "disabled" | "onValueCommitted" | "onBlur"
	>;
};

export function NumberField(props: NumberFieldProps) {
	const { label, description, required, disabled, externalError, inputProps } = props;

	const field = useFieldContext<number | null>();
	const errors = field.state.meta.errorMap.onBlur ?? field.state.meta.errorMap.onSubmit;
	const isInvalid =
		Boolean(externalError) ||
		((field.state.meta.isTouched || field.state.meta.errorMap.onSubmit !== undefined) &&
			errors !== undefined);

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
			<NumberInput
				id={field.name}
				name={field.name}
				value={Number.isFinite(field.state.value) ? field.state.value : null}
				disabled={disabled}
				onValueCommitted={(value) => field.handleChange(value)}
				onBlur={field.handleBlur}
				{...inputProps}
			/>
			{description && <Field.Description>{description}</Field.Description>}
			{externalError && <Field.Error>{externalError}</Field.Error>}
			{isInvalid &&
				!externalError &&
				errors?.map((error: { message: string }) => (
					<Field.Error key={error.message}>{error.message}</Field.Error>
				))}
		</Field>
	);
}
