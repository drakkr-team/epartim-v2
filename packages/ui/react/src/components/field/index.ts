import { FieldDescription, FieldError, FieldLabel, FieldRoot } from "./field";

export { Field as FieldHeadless } from "@base-ui/react/field";

export const Field = Object.assign(FieldRoot, {
	Label: FieldLabel,
	Description: FieldDescription,
	Error: FieldError,
});

export type {
	FieldDescriptionProps,
	FieldErrorProps,
	FieldLabelProps,
	FieldRootProps as FieldProps,
} from "./field";
