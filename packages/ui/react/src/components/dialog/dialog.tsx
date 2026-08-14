import { Dialog as DialogHeadless } from "@base-ui/react/dialog";
import { cn } from "tailwind-variants";

export type DialogRootProps = DialogHeadless.Root.Props;

export function DialogRoot(props: DialogRootProps) {
	return <DialogHeadless.Root {...props} />;
}

export type DialogTriggerProps = DialogHeadless.Trigger.Props;

export function DialogTrigger(props: DialogTriggerProps) {
	return <DialogHeadless.Trigger {...props} />;
}

export type DialogContentProps = DialogHeadless.Popup.Props;

export function DialogContent(props: DialogContentProps) {
	const { className, ...rest } = props;

	return (
		<DialogHeadless.Portal>
			<DialogHeadless.Backdrop className="fixed inset-0 backdrop-blur-xs transition duration-300 data-ending-style:opacity-0 data-starting-style:opacity-0 sm:duration-150" />
			<DialogHeadless.Popup
				className={cn(
					"fixed right-0 bottom-0 m-2 h-fit w-[calc(100%-1rem)] rounded-2xl border border-neutral-7 bg-neutral-1 p-4 transition duration-300 sm:right-1/2 sm:bottom-1/2 sm:m-0 sm:translate-x-1/2 sm:translate-y-1/2 sm:duration-150",
					"data-starting-style:translate-y-full data-starting-style:opacity-0 sm:data-starting-style:translate-y-1/2 sm:data-starting-style:scale-95",
					"data-ending-style:translate-y-full data-ending-style:opacity-0 sm:data-ending-style:translate-y-1/2 sm:data-ending-style:scale-95",
					className,
				)}
				{...rest}
			/>
		</DialogHeadless.Portal>
	);
}

export type DialogCloseProps = DialogHeadless.Close.Props;

export function DialogClose(props: DialogCloseProps) {
	return <DialogHeadless.Close {...props} />;
}

export type DialogTitleProps = DialogHeadless.Title.Props;

export function DialogTitle(props: DialogTitleProps) {
	return <DialogHeadless.Title {...props} />;
}

export type DialogDescriptionProps = DialogHeadless.Description.Props;

export function DialogDescription(props: DialogDescriptionProps) {
	return <DialogHeadless.Description {...props} />;
}
