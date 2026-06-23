import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { cn } from "tailwind-variants";

export type DialogRootProps = DialogPrimitive.Root.Props;

export function DialogRoot(props: DialogRootProps) {
	return <DialogPrimitive.Root {...props} />;
}

export type DialogTriggerProps = DialogPrimitive.Trigger.Props;

export function DialogTrigger(props: DialogTriggerProps) {
	return <DialogPrimitive.Trigger {...props} />;
}

export type DialogContentProps = DialogPrimitive.Popup.Props;

export function DialogContent(props: DialogContentProps) {
	const { className, ...rest } = props;

	return (
		<DialogPrimitive.Portal>
			<DialogPrimitive.Backdrop className="fixed inset-0 backdrop-blur-xs transition duration-300 data-ending-style:opacity-0 data-starting-style:opacity-0 sm:duration-150" />
			<DialogPrimitive.Popup
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
		</DialogPrimitive.Portal>
	);
}

export type DialogCloseProps = DialogPrimitive.Close.Props;

export function DialogClose(props: DialogCloseProps) {
	return <DialogPrimitive.Close {...props} />;
}

export type DialogTitleProps = DialogPrimitive.Title.Props;

export function DialogTitle(props: DialogTitleProps) {
	return <DialogPrimitive.Title {...props} />;
}

export type DialogDescriptionProps = DialogPrimitive.Description.Props;

export function DialogDescription(props: DialogDescriptionProps) {
	return <DialogPrimitive.Description {...props} />;
}
