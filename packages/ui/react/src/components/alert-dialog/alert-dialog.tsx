import { AlertDialog as AlertDialogHeadless } from "@base-ui/react/alert-dialog";
import { cn } from "tailwind-variants";

export type AlertDialogRootProps = AlertDialogHeadless.Root.Props;

export function AlertDialogRoot(props: AlertDialogRootProps) {
	return <AlertDialogHeadless.Root {...props} />;
}

export type AlertDialogTriggerProps = AlertDialogHeadless.Trigger.Props;

export function AlertDialogTrigger(props: AlertDialogTriggerProps) {
	return <AlertDialogHeadless.Trigger {...props} />;
}

export type AlertDialogContentProps = AlertDialogHeadless.Popup.Props;

export function AlertDialogContent(props: AlertDialogContentProps) {
	const { className, ...rest } = props;

	return (
		<AlertDialogHeadless.Portal>
			<AlertDialogHeadless.Backdrop className="fixed inset-0 backdrop-blur-xs transition duration-300 data-ending-style:opacity-0 data-starting-style:opacity-0 sm:duration-150" />
			<AlertDialogHeadless.Popup
				className={cn(
					"fixed right-0 bottom-0 m-2 h-fit w-[calc(100%-1rem)] rounded-2xl border border-neutral-7 bg-neutral-1 p-4 transition duration-300 sm:right-1/2 sm:bottom-1/2 sm:m-0 sm:translate-x-1/2 sm:translate-y-1/2 sm:duration-150",
					"data-starting-style:translate-y-full data-starting-style:opacity-0 sm:data-starting-style:translate-y-1/2 sm:data-starting-style:scale-95",
					"data-ending-style:translate-y-full data-ending-style:opacity-0 sm:data-ending-style:translate-y-1/2 sm:data-ending-style:scale-95",
					className,
				)}
				{...rest}
			/>
		</AlertDialogHeadless.Portal>
	);
}

export type AlertDialogCloseProps = AlertDialogHeadless.Close.Props;

export function AlertDialogClose(props: AlertDialogCloseProps) {
	return <AlertDialogHeadless.Close {...props} />;
}

export type AlertDialogTitleProps = AlertDialogHeadless.Title.Props;

export function AlertDialogTitle(props: AlertDialogTitleProps) {
	return <AlertDialogHeadless.Title {...props} />;
}

export type AlertDialogDescriptionProps = AlertDialogHeadless.Description.Props;

export function AlertDialogDescription(props: AlertDialogDescriptionProps) {
	return <AlertDialogHeadless.Description {...props} />;
}
