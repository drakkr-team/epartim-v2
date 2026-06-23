import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
import { tv, type VariantProps } from "tailwind-variants";

const ScrollAreaVariant = tv({
	slots: {
		root: "h-full w-full overflow-auto outline-none",
		viewport: "h-full w-full overflow-auto outline-none",
		scrollbar:
			"pointer-events-none m-0.75 hidden rounded-sm opacity-0 transition-opacity data-hovering:pointer-events-auto data-scrolling:pointer-events-auto data-hovering:opacity-100 data-scrolling:opacity-100",
		thumb: "rounded-sm bg-neutral-9",
	},
	variants: {
		variant: {
			scrollbar: null,
			gradient: {
				viewport:
					"data-overflow-x-end:mask-r-from-90% data-overflow-x-start:mask-l-from-90% data-overflow-y-end:mask-b-from-90% data-overflow-y-start:mask-t-from-90%",
			},
			both: {
				viewport:
					"data-overflow-x-end:mask-r-from-90% data-overflow-x-start:mask-l-from-90% data-overflow-y-end:mask-b-from-90% data-overflow-y-start:mask-t-from-90%",
			},
		},
	},
	defaultVariants: {
		variant: "both",
	},
});

const { root, scrollbar, thumb, viewport } = ScrollAreaVariant();

export type ScrollAreaRootProps = ScrollAreaPrimitive.Root.Props &
	VariantProps<typeof ScrollAreaVariant>;

export function ScrollAreaRoot(props: ScrollAreaRootProps) {
	const { children, variant, className, ...rest } = props;

	return (
		<ScrollAreaPrimitive.Root
			className={root({ variant, className: className?.toString() })}
			{...rest}
		>
			<ScrollAreaPrimitive.Viewport className={viewport({ variant })}>
				{children}
			</ScrollAreaPrimitive.Viewport>

			{variant !== "gradient" && (
				<>
					<ScrollAreaPrimitive.Scrollbar
						orientation="vertical"
						className={scrollbar({ variant, className: "w-0.75 data-has-overflow-y:block" })}
					>
						<ScrollAreaPrimitive.Thumb className={thumb({ variant, className: "w-full" })} />
					</ScrollAreaPrimitive.Scrollbar>

					<ScrollAreaPrimitive.Scrollbar
						orientation="horizontal"
						className={scrollbar({ variant, className: "h-0.75 data-has-overflow-x:block" })}
					>
						<ScrollAreaPrimitive.Thumb className={thumb({ variant, className: "h-full" })} />
					</ScrollAreaPrimitive.Scrollbar>
					<ScrollAreaPrimitive.Corner />
				</>
			)}
		</ScrollAreaPrimitive.Root>
	);
}
