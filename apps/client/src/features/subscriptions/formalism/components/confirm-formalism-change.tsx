import { useTranslation } from "react-i18next";

import { AlertDialog } from "@workspace/ui-react/components/alert-dialog";
import { Button } from "@workspace/ui-react/components/button";

export function ConfirmFormalismChange({
	open,
	onCancel,
	onConfirm,
}: {
	open: boolean;
	onCancel: () => void;
	onConfirm: () => void;
}) {
	const { t } = useTranslation("features.subscriptions.formalism");
	return (
		<AlertDialog
			open={open}
			onOpenChange={(next) => {
				if (!next) onCancel();
			}}
		>
			<AlertDialog.Content className="grid gap-6 sm:max-w-lg">
				<div className="grid gap-3">
					<AlertDialog.Title className="font-bold text-secondary-12 text-xl">
						{t("confirm.method.title")}
					</AlertDialog.Title>
					<AlertDialog.Description className="text-neutral-11 text-sm">
						{t("confirm.method.description")}
					</AlertDialog.Description>
				</div>
				<div className="flex flex-wrap justify-end gap-3">
					<Button type="button" variant="default" onClick={onCancel}>
						{t("action.cancel")}
					</Button>
					<Button type="button" variant="destructive" onClick={onConfirm}>
						{t("action.confirm")}
					</Button>
				</div>
			</AlertDialog.Content>
		</AlertDialog>
	);
}
