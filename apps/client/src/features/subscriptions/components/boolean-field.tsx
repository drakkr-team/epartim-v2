import type { FocusEventHandler } from "react";

import { Button } from "@workspace/ui-react/components/button";
import { Field } from "@workspace/ui-react/components/field";

export type BooleanFieldProps = {
	className?: string;
	disabled?: boolean;
	errorMessages?: string[];
	invalid?: boolean;
	label: string;
	noLabel: string;
	onBlur?: FocusEventHandler<HTMLDivElement>;
	onValueChange: (value: boolean) => void;
	required?: boolean;
	value: boolean | null;
	yesLabel: string;
};

export function BooleanField(props: BooleanFieldProps) {
	const {
		className,
		disabled = false,
		errorMessages = [],
		invalid = false,
		label,
		noLabel,
		onBlur,
		onValueChange,
		required = false,
		value,
		yesLabel,
	} = props;

	return (
		<Field
			invalid={invalid}
			className={["flex flex-col gap-2", className].filter(Boolean).join(" ")}
		>
			<Field.Label required={required}>{label}</Field.Label>
			<div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2" onBlur={onBlur}>
				<Button
					disabled={disabled}
					type="button"
					role="radio"
					aria-checked={value === true}
					variant={value === true ? "primary" : "default"}
					onClick={() => onValueChange(true)}
				>
					{yesLabel}
				</Button>
				<Button
					disabled={disabled}
					type="button"
					role="radio"
					aria-checked={value === false}
					variant={value === false ? "primary" : "default"}
					onClick={() => onValueChange(false)}
				>
					{noLabel}
				</Button>
			</div>
			{invalid && errorMessages.map((error) => <Field.Error key={error}>{error}</Field.Error>)}
		</Field>
	);
}
