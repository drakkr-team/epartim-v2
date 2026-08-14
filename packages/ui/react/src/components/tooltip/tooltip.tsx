import { Tooltip } from "@base-ui/react/tooltip";
import { cn, cx } from "tailwind-variants";

export type TooltipProviderProps = Tooltip.Provider.Props;

export function TooltipProvider(props: TooltipProviderProps) {
	return <Tooltip.Provider {...props} />;
}

export type TooltipRootProps = Tooltip.Root.Props;

export function TooltipRoot(props: TooltipRootProps) {
	return <Tooltip.Root {...props} />;
}

export type TooltipTriggerProps = Tooltip.Trigger.Props;

export function TooltipTrigger(props: TooltipTriggerProps) {
	return <Tooltip.Trigger {...props} />;
}

export type TooltipContentProps = Tooltip.Positioner.Props;

export function TooltipContent(props: TooltipContentProps) {
	const { children, className, sideOffset = 6, ...rest } = props;

	return (
		<Tooltip.Portal>
			<Tooltip.Positioner sideOffset={sideOffset} {...rest}>
				<Tooltip.Popup
					className={cn(
						"max-h-(--available-height) max-w-(--available-width) origin-(--transform-origin) rounded-md bg-neutral-12 px-2 py-1 text-neutral-1 text-sm shadow shadow-neutral-5 transition",
						"data-starting-style:data-[side=inline-end]:-translate-x-1 data-starting-style:data-[side=inline-start]:translate-x-1 data-starting-style:data-[side=left]:translate-x-1 data-starting-style:data-[side=right]:-translate-x-1 data-starting-style:data-[side=bottom]:-translate-y-1 data-starting-style:data-[side=top]:translate-y-1 data-starting-style:scale-95 data-starting-style:opacity-0 data-starting-style:blur-xs",
						"data-ending-style:data-[side=inline-end]:-translate-x-1 data-ending-style:data-[side=inline-start]:translate-x-1 data-ending-style:data-[side=left]:translate-x-1 data-ending-style:data-[side=right]:-translate-x-1 data-ending-style:data-[side=bottom]:-translate-y-1 data-ending-style:data-[side=top]:translate-y-1 data-ending-style:scale-95 data-ending-style:opacity-0 data-ending-style:blur-xs",
						"data-instant:transition-none",
						className,
					)}
				>
					<Tooltip.Arrow
						className={cx(
							"relative block h-1.5 w-3 overflow-clip",
							"before:transform-[translate(-50%,50%)_rotate(45deg)] before:absolute before:bottom-0 before:left-1/2 before:h-[calc(6px*sqrt(2))] before:w-[calc(6px*sqrt(2))] before:bg-neutral-12 before:shadow before:shadow-neutral-5 before:content-['']",
							"data-[side=bottom]:-top-1.5 data-[side=top]:rotate-180",
							"data-[side=left]:-right-2.25 data-[side=right]:-rotate-90",
							"data-[side=top]:-bottom-1.5",
							"data-[side=right]:-left-2.25 data-[side=left]:rotate-90",
						)}
					/>
					{children}
				</Tooltip.Popup>
			</Tooltip.Positioner>
		</Tooltip.Portal>
	);
}
