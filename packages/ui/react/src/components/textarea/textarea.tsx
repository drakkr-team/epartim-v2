import {
	type ComponentProps,
	type CSSProperties,
	type ReactNode,
	useLayoutEffect,
	useRef,
} from "react";
import { cn } from "tailwind-variants";

import { useElementSize } from "../../hooks/use-element-size";
import { useMergeRefs } from "../../hooks/use-merge-refs";

export type TextareaRootProps = ComponentProps<"textarea"> & {
	autoResize?: boolean;
	topSlot?: ReactNode;
	bottomSlot?: ReactNode;
};

export function TextareaRoot(props: TextareaRootProps) {
	const { ref, className, autoResize, topSlot, bottomSlot, ...rest } = props;

	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const mergedRef = useMergeRefs(textareaRef, ref);
	const { ref: topSlotRef, size: topSlotSize } = useElementSize();
	const { ref: bottomSlotRef, size: bottomSlotSize } = useElementSize();

	useLayoutEffect(() => {
		const element = textareaRef.current;
		if (!autoResize || !element) {
			return;
		}

		const observer = new MutationObserver(() => {
			element.style.height = "inherit";
			element.style.height = `${element.scrollHeight}px`;
		});
		observer.observe(element, {
			childList: true,
		});

		return () => observer.disconnect();
	}, [autoResize]);

	return (
		<div className="relative inline-flex has-disabled:opacity-50">
			{topSlot && (
				<span
					ref={topSlotRef}
					className="absolute top-px right-px left-px rounded-t-lg bg-neutral-1 p-2"
				>
					{topSlot}
				</span>
			)}
			<textarea
				ref={mergedRef}
				className={cn(
					// Default
					"w-full flex-1 resize-y rounded-lg border border-neutral-7 bg-neutral-1 p-2 text-start text-base text-neutral-12 outline-none ring-primary-7 transition sm:text-sm",
					// Placeholder
					"placeholder:text-neutral-9",
					// Hover
					"hover:not-data-disabled:border-neutral-8",
					// Focus
					"focus-visible:border-primary-8 focus-visible:ring-3 focus-visible:hover:border-primary-8",
					// Popup open
					"data-popup-open:border-primary-8 data-popup-open:ring-3 data-popup-open:hover:border-primary-8",
					// Disabled
					"data-disabled:cursor-not-allowed",
					// Invalid
					"data-invalid:border-error-7 data-invalid:ring-error-7",
					// Invalid Hover
					"data-invalid:hover:not-data-disabled:border-error-8",
					// Invalid Focus
					"data-invalid:focus-visible:border-error-8 data-invalid:hover:border-error-8",
					// Invalid Popup open
					"data-invalid:data-popup-open:border-error-8 data-invalid:data-popup-open:hover:border-error-8",
					// With top slot
					topSlot && "pt-[calc(1rem+var(--top-slot-height))]",
					// With bottom slot
					bottomSlot && "pb-[calc(1rem+var(--bottom-slot-height))]",
					// Auto resize
					autoResize && "resize-none overflow-hidden",
					// Overwrite
					className,
				)}
				style={
					{
						"--top-slot-height": `${topSlotSize.height}px`,
						"--bottom-slot-height": `${bottomSlotSize.height}px`,
					} as CSSProperties
				}
				{...rest}
			/>
			{bottomSlot && (
				<span
					ref={bottomSlotRef}
					className="absolute right-px bottom-px left-px rounded-b-lg bg-neutral-1 p-2"
				>
					{bottomSlot}
				</span>
			)}
		</div>
	);
}
