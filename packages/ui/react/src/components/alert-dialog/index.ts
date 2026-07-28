import {
	AlertDialogClose,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogRoot,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "./alert-dialog";

export { AlertDialog as AlertDialogHeadless } from "@base-ui/react/alert-dialog";

export const AlertDialog = Object.assign(AlertDialogRoot, {
	Trigger: AlertDialogTrigger,
	Content: AlertDialogContent,
	Close: AlertDialogClose,
	Title: AlertDialogTitle,
	Description: AlertDialogDescription,
});

export type {
	AlertDialogCloseProps,
	AlertDialogContentProps,
	AlertDialogDescriptionProps,
	AlertDialogRootProps as AlertDialogProps,
	AlertDialogTitleProps,
	AlertDialogTriggerProps,
} from "./alert-dialog";
