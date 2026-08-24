import { Tabs as TabsHeadless } from "@base-ui/react/tabs";
import { cn } from "tailwind-variants";

import { ScrollArea } from "../scroll-area";

export type TabsRootProps = TabsHeadless.Root.Props;

export function TabsRoot(props: TabsRootProps) {
	return <TabsHeadless.Root {...props} />;
}

export type TabsListProps = TabsHeadless.List.Props;

export function TabsList(props: TabsListProps) {
	const { children, className, ...rest } = props;

	return (
		<ScrollArea variant="gradient" className="border-neutral-7 border-b">
			<TabsHeadless.List className={cn("relative flex items-center gap-2", className)} {...rest}>
				{children}
				<TabsHeadless.Indicator className="absolute bottom-0 h-0.5 w-(--active-tab-width) translate-x-(--active-tab-left) bg-primary-9 transition-all" />
			</TabsHeadless.List>
		</ScrollArea>
	);
}

export type TabsTabProps = TabsHeadless.Tab.Props;

export function TabsTab(props: TabsTabProps) {
	const { className, ...rest } = props;

	return (
		<TabsHeadless.Tab
			className={cn(
				"mb-2 inline-flex h-10 w-fit shrink-0 cursor-pointer select-none items-center justify-center gap-2 rounded-md px-6 font-medium text-neutral-12 text-sm outline-none transition sm:h-9 [&_svg]:size-4",
				"hover:not-data-disabled:bg-neutral-3",
				"focus-visible:bg-neutral-3!",
				"data-active:bg-neutral-4",
				"active:not-data-disabled:bg-neutral-4!",
				"data-disabled:cursor-not-allowed data-disabled:opacity-50",
				className,
			)}
			{...rest}
		/>
	);
}

export type TabsPanelProps = TabsHeadless.Panel.Props;

export function TabsPanel(props: TabsPanelProps) {
	return <TabsHeadless.Panel {...props} />;
}
