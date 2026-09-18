import { Field } from "@workspace/ui-react/components/field";
import {
	PasswordInput,
	type PasswordInputProps,
} from "@workspace/ui-react/components/password-input";

import { useFieldContext } from "#/libs/form";

type PasswordFieldProps = {
	label?: string;
	description?: string;
	required?: boolean;
	disabled?: boolean;
	inputProps?: Omit<
		PasswordInputProps,
		"id" | "name" | "value" | "onChange" | "onBlur" | "aria-invalid" | "disabled"
	>;
};

export function PasswordField(props: PasswordFieldProps) {
	const { label, description, required, disabled, inputProps } = props;

	const field = useFieldContext<string>();
	const isInvalid = field.state.meta.isTouched && field.state.meta.errorMap.onBlur !== undefined;

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
			<PasswordInput
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
				field.state.meta.errorMap.onBlur?.map((error: { message: string }) => (
					<Field.Error key={error.message}>{error.message}</Field.Error>
				))}
		</Field>
	);
}
