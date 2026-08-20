import { Button, type ButtonProps } from "@workspace/ui-react/components/button";
import { Spinner } from "@workspace/ui-react/components/spinner";

import { useFormContext } from "#/libs/form";

type SubmitButtonProps = Omit<ButtonProps, "type">;

export function SubmitButton(props: SubmitButtonProps) {
	const { children, disabled, ...rest } = props;

	const form = useFormContext();

	return (
		<form.Subscribe selector={(state) => state.isSubmitting}>
			{(isSubmitting) => (
				<Button type="submit" disabled={isSubmitting || disabled} {...rest}>
					{isSubmitting && <Spinner />}
					{children}
				</Button>
			)}
		</form.Subscribe>
	);
}
