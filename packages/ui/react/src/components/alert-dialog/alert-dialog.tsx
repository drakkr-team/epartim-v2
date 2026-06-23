import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
import { cn } from "tailwind-variants";

export type AlertDialogRootProps = AlertDialogPrimitive.Root.Props;

export function AlertDialogRoot(props: AlertDialogRootProps) {
	return <AlertDialogPrimitive.Root {...props} />;
}

export type AlertDialogTriggerProps = AlertDialogPrimitive.Trigger.Props;

export function AlertDialogTrigger(props: AlertDialogTriggerProps) {
	return <AlertDialogPrimitive.Trigger {...props} />;
}

export type AlertDialogContentProps = AlertDialogPrimitive.Popup.Props;

export function AlertDialogContent(props: AlertDialogContentProps) {
	const { className, ...rest } = props;

	return (
		<AlertDialogPrimitive.Portal>
			<AlertDialogPrimitive.Backdrop className="fixed inset-0 backdrop-blur-xs transition duration-300 data-ending-style:opacity-0 data-starting-style:opacity-0 sm:duration-150" />
			<AlertDialogPrimitive.Popup
				className={cn(
					// Default
					"fixed right-0 bottom-0 m-2 h-fit w-[calc(100%-1rem)] rounded-2xl border border-neutral-7 bg-neutral-1 p-4 transition duration-300 sm:right-1/2 sm:bottom-1/2 sm:m-0 sm:translate-x-1/2 sm:translate-y-1/2 sm:duration-150",
					// Starting Animation
					"data-starting-style:translate-y-full data-starting-style:opacity-0 sm:data-starting-style:translate-y-1/2 sm:data-starting-style:scale-95",
					// Ending Animation
					"data-ending-style:translate-y-full data-ending-style:opacity-0 sm:data-ending-style:translate-y-1/2 sm:data-ending-style:scale-95",
					// Overwite
					className,
				)}
				{...rest}
			/>
		</AlertDialogPrimitive.Portal>
	);
}

export type AlertDialogCloseProps = AlertDialogPrimitive.Close.Props;

export function AlertDialogClose(props: AlertDialogCloseProps) {
	return <AlertDialogPrimitive.Close {...props} />;
}

export type AlertDialogTitleProps = AlertDialogPrimitive.Title.Props;

export function AlertDialogTitle(props: AlertDialogTitleProps) {
	return <AlertDialogPrimitive.Title {...props} />;
}

export type AlertDialogDescriptionProps = AlertDialogPrimitive.Description.Props;

export function AlertDialogDescription(props: AlertDialogDescriptionProps) {
	return <AlertDialogPrimitive.Description {...props} />;
}
