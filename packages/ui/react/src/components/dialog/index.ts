import {
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogRoot,
	DialogTitle,
	DialogTrigger,
} from "./dialog";

export { Dialog as DialogHeadless } from "@base-ui/react/dialog";

export const Dialog = Object.assign(DialogRoot, {
	Trigger: DialogTrigger,
	Content: DialogContent,
	Close: DialogClose,
	Title: DialogTitle,
	Description: DialogDescription,
});

export type {
	DialogCloseProps,
	DialogContentProps,
	DialogDescriptionProps,
	DialogRootProps as DialogProps,
	DialogTitleProps,
	DialogTriggerProps,
} from "./dialog";
