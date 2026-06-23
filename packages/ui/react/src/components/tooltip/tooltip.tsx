import { Tooltip } from "@base-ui/react/tooltip";
import { cn } from "tailwind-variants";

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
	const { children, className, sideOffset = 4, ...rest } = props;

	return (
		<Tooltip.Portal>
			<Tooltip.Positioner sideOffset={sideOffset} {...rest}>
				<Tooltip.Popup
					className={cn(
						// Default
						"max-h-(--available-height) max-w-(--available-width) origin-(--transform-origin) rounded-md bg-neutral-12 px-2 py-1 text-neutral-1 text-sm shadow shadow-neutral-5 transition",
						// Starting Animation
						"data-starting-style:data-[side=inline-end]:-translate-x-1 data-starting-style:data-[side=inline-start]:translate-x-1 data-starting-style:data-[side=left]:translate-x-1 data-starting-style:data-[side=right]:-translate-x-1 data-starting-style:data-[side=bottom]:-translate-y-1 data-starting-style:data-[side=top]:translate-y-1 data-starting-style:scale-95 data-starting-style:opacity-0 data-starting-style:blur-xs",
						// Ending Animation
						"data-ending-style:data-[side=inline-end]:-translate-x-1 data-ending-style:data-[side=inline-start]:translate-x-1 data-ending-style:data-[side=left]:translate-x-1 data-ending-style:data-[side=right]:-translate-x-1 data-ending-style:data-[side=bottom]:-translate-y-1 data-ending-style:data-[side=top]:translate-y-1 data-ending-style:scale-95 data-ending-style:opacity-0 data-ending-style:blur-xs",
						// Instante Animation
						"data-instant:transition-none",
						// Override
						className,
					)}
				>
					{children}
				</Tooltip.Popup>
			</Tooltip.Positioner>
		</Tooltip.Portal>
	);
}
