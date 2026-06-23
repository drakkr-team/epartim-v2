import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cn } from "tailwind-variants";

import { ScrollArea } from "../scroll-area";

export type TabsRootProps = TabsPrimitive.Root.Props;

export function TabsRoot(props: TabsRootProps) {
	return <TabsPrimitive.Root {...props} />;
}

export type TabsListProps = TabsPrimitive.List.Props;

export function TabsList(props: TabsListProps) {
	const { children, className, ...rest } = props;

	return (
		<ScrollArea variant="gradient" className="border-neutral-7 border-b">
			<TabsPrimitive.List className={cn("relative flex items-center gap-2", className)} {...rest}>
				{children}
				<TabsPrimitive.Indicator className="absolute bottom-0 h-0.5 w-(--active-tab-width) translate-x-(--active-tab-left) bg-primary-9 transition-all" />
			</TabsPrimitive.List>
		</ScrollArea>
	);
}

export type TabsTabProps = TabsPrimitive.Tab.Props;

export function TabsTab(props: TabsTabProps) {
	const { className, ...rest } = props;

	return (
		<TabsPrimitive.Tab
			className={cn(
				// Default
				"mb-2 inline-flex h-10 w-fit shrink-0 cursor-pointer select-none items-center justify-center gap-2 rounded-lg px-6 font-medium text-neutral-12 text-sm outline-none transition sm:h-9 [&_svg]:size-4",
				// Hover
				"hover:not-data-disabled:bg-neutral-3",
				// Focus
				"focus-visible:bg-neutral-3",
				// Active
				"data-active:bg-neutral-3",
				// Active Hover
				"data-active:hover:not-data-disabled:bg-neutral-4",
				// Active Focus
				"data-active:focus-visible:bg-neutral-4",
				// Disabled
				"data-disabled:cursor-not-allowed data-disabled:opacity-50",
				// Overwrite
				className,
			)}
			{...rest}
		/>
	);
}

export type TabsPanelProps = TabsPrimitive.Panel.Props;

export function TabsPanel(props: TabsPanelProps) {
	return <TabsPrimitive.Panel {...props} />;
}
