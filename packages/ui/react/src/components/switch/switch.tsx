import { Switch as SwitchHeadless } from "@base-ui/react/switch";
import { cn, cx } from "tailwind-variants";

export type SwitchRootProps = Omit<SwitchHeadless.Root.Props, "children">;

export function SwitchRoot(props: SwitchRootProps) {
	const { className, ...rest } = props;

	return (
		<SwitchHeadless.Root
			className={cn(
				"group relative flex h-6 w-9 cursor-pointer items-center rounded-full border-2 outline-none ring-primary-7 transition",
				"data-unchecked:border-neutral-9 data-unchecked:bg-neutral-9",
				"data-unchecked:hover:not-disabled:border-neutral-10 data-unchecked:hover:not-disabled:bg-neutral-10",
				"data-checked:border-primary-9 data-checked:bg-primary-9",
				"data-checked:hover:not-disabled:border-primary-10 data-checked:hover:not-disabled:bg-primary-10",
				"focus-visible:ring-3",
				"data-disabled:cursor-not-allowed data-disabled:opacity-50",
				"before:absolute before:-inset-2",
				className,
			)}
			{...rest}
		>
			<SwitchHeadless.Thumb
				className={cx(
					"aspect-square h-full rounded-full bg-neutral-1 transition dark:bg-neutral-12",
					"data-checked:translate-x-3",
				)}
			/>
		</SwitchHeadless.Root>
	);
}
