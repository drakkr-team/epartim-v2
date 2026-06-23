import { Field } from "@workspace/ui-react/components/field";
import { Switch, type SwitchProps } from "@workspace/ui-react/components/switch";

import { useFieldContext } from "#/libs/form";

type SwitchFieldProps = {
	label?: string;
	description?: string;
	required?: boolean;
	disabled?: boolean;
	inputProps?: Omit<
		SwitchProps,
		"id" | "name" | "checked" | "disabled" | "onCheckedChange" | "onBlur" | "aria-invalid"
	>;
};

export function SwitchField(props: SwitchFieldProps) {
	const { label, description, required, disabled, inputProps } = props;

	const field = useFieldContext<boolean>();
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

	return (
		<Field
			name={field.name}
			invalid={isInvalid}
			disabled={disabled}
			className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1"
		>
			<Switch
				id={field.name}
				name={field.name}
				checked={field.state.value}
				aria-invalid={isInvalid}
				disabled={disabled}
				onCheckedChange={(checked) => field.handleChange(checked)}
				onBlur={field.handleBlur}
				{...inputProps}
			/>
			{label && (
				<Field.Label htmlFor={field.name} required={required} className="col-start-2">
					{label}
				</Field.Label>
			)}
			{description && <Field.Description className="col-start-2">{description}</Field.Description>}
			{isInvalid &&
				field.state.meta.errors.map((error) => (
					<Field.Error key={`${error.code}-${error.path}`} className="col-start-2">
						{error.message}
					</Field.Error>
				))}
		</Field>
	);
}
