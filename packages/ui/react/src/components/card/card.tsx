import { mergeProps } from "@base-ui/react";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "tailwind-variants";

export type CardRootProps = useRender.ComponentProps<"div">;

export function CardRoot(props: CardRootProps) {
	const { className, render, ...rest } = props;

	const element = useRender({
		defaultTagName: "div",
		render,
		props: mergeProps<"div">(
			{
				className: cn(
					"rounded-sm border border-neutral-6 bg-neutral-1 p-4 shadow shadow-neutral-5",
					className,
				),
			},
			rest,
		),
	});

	return element;
}
