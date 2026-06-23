import type { ComponentProps } from "react";
import { cn } from "tailwind-variants";

import { LoaderCircleIcon } from "../../icons";

export type SpinnerRootProps = ComponentProps<typeof LoaderCircleIcon>;

export function SpinnerRoot(props: SpinnerRootProps) {
	const { className, ...rest } = props;

	return <LoaderCircleIcon className={cn("animate-spin", className)} {...rest} />;
}
