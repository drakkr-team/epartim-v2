import { Input as InputHeadless } from "@base-ui/react/input";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "tailwind-variants";

import { useElementSize } from "../../hooks/use-element-size";

export type InputRootProps = InputHeadless.Props & {
	leftSlot?: ReactNode;
	rightSlot?: ReactNode;
};

export function InputRoot(props: InputRootProps) {
	const { className, leftSlot, rightSlot, ...rest } = props;

	const { ref: leftSlotRef, size: leftSlotSize } = useElementSize();
	const { ref: rightSlotRef, size: rightSlotSize } = useElementSize();

	return (
		<div className="relative flex w-full items-center has-[input[data-disabled]]:opacity-50">
			{leftSlot && (
				<span ref={leftSlotRef} className="pointer-events-none absolute left-1.5 flex items-center">
					{leftSlot}
				</span>
			)}
			<InputHeadless
				className={cn(
					"h-10 w-full flex-1 rounded-md border border-neutral-7 bg-neutral-1 px-2 text-start text-base text-neutral-12 outline-none ring-primary-7 transition sm:h-9 sm:text-sm",
					"placeholder:text-neutral-9",
					"hover:not-data-disabled:border-neutral-8",
					"focus-visible:border-primary-8 focus-visible:ring-3 focus-visible:hover:border-primary-8",
					"data-popup-open:border-primary-8 data-popup-open:ring-3 data-popup-open:hover:border-primary-8",
					"data-disabled:cursor-not-allowed",
					"data-invalid:border-error-7 data-invalid:ring-error-7",
					"data-invalid:hover:not-data-disabled:border-error-8",
					"data-invalid:focus-visible:border-error-8 data-invalid:hover:border-error-8",
					"data-invalid:data-popup-open:border-error-8 data-invalid:data-popup-open:hover:border-error-8",
					leftSlot && "pl-[calc(0.5rem+var(--left-slot-width))]",
					rightSlot && "pr-[calc(0.5rem+var(--right-slot-width))]",
					className,
				)}
				style={
					{
						"--left-slot-width": `${leftSlotSize.width}px`,
						"--right-slot-width": `${rightSlotSize.width}px`,
					} as CSSProperties
				}
				{...rest}
			/>
			{rightSlot && (
				<span
					ref={rightSlotRef}
					className="pointer-events-none absolute right-1.5 flex items-center"
				>
					{rightSlot}
				</span>
			)}
		</div>
	);
}
