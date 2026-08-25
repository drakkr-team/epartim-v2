import { Field as FieldHeadless } from "@base-ui/react/field";
import { cn } from "tailwind-variants";

export type FieldRootProps = FieldHeadless.Root.Props;

export function FieldRoot(props: FieldRootProps) {
	return <FieldHeadless.Root {...props} />;
}

export type FieldLabelProps = FieldHeadless.Label.Props & {
	required?: boolean;
};

export function FieldLabel(props: FieldLabelProps) {
	const { required, className, ...rest } = props;

	return (
		<FieldHeadless.Label
			className={cn(
				"font-semibold text-2xs text-neutral-11 uppercase tracking-widest data-invalid:text-error-11",
				"data-disabled:opacity-50",
				required && "after:mr-0.5 after:inline-block after:text-error-11 after:content-['*']",
				className,
			)}
			{...rest}
		/>
	);
}

export type FieldDescriptionProps = FieldHeadless.Description.Props;

export function FieldDescription(props: FieldDescriptionProps) {
	const { className, ...rest } = props;

	return (
		<FieldHeadless.Description className={cn("text-neutral-11 text-xs", className)} {...rest} />
	);
}

export type FieldErrorProps = Omit<FieldHeadless.Error.Props, "match">;

export function FieldError(props: FieldErrorProps) {
	const { className, ...rest } = props;

	return (
		<FieldHeadless.Error
			match={true}
			className={cn("font-semibold text-error-11 text-xs", className)}
			{...rest}
		/>
	);
}
