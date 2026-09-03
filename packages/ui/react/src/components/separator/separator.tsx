import { Separator } from "@base-ui/react/separator";
import { cn } from "tailwind-variants";

export type SeparatorRootProps = Separator.Props;

export function SeparatorRoot(props: SeparatorRootProps) {
	const { className, orientation = "horizontal", ...otherProps } = props;

	return (
		<Separator
			className={cn(
				"bg-neutral-6",
				{
					"h-px": orientation === "horizontal",
					"w-px": orientation === "vertical",
				},
				className,
			)}
			orientation={orientation}
			{...otherProps}
		/>
	);
}
