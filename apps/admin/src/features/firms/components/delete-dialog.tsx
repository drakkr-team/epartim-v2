import { useTranslation } from "react-i18next";

import type { Firm } from "@workspace/api/data";
import { AlertDialog, type AlertDialogProps } from "@workspace/ui-react/components/alert-dialog";
import { Button } from "@workspace/ui-react/components/button";
import { Spinner } from "@workspace/ui-react/components/spinner";

import { useDeleteFirmMutation } from "#/features/firms/hooks/use-delete-mutation";

type DeleteFirmDialogProps = AlertDialogProps & {
	firm: Firm;
	afterDelete?: () => void;
};

export function DeleteFirmDialog(props: DeleteFirmDialogProps) {
	const { firm, afterDelete, ...rest } = props;

	const { t } = useTranslation("features.firms.components.delete-dialog");

	const { mutateAsync: deleteFirm, isPending } = useDeleteFirmMutation();

	const handleDelete = async () => {
		await deleteFirm({ params: { firmId: firm.id } });
		afterDelete?.();
	};

	return (
		<AlertDialog {...rest}>
			<AlertDialog.Content className="grid max-w-lg gap-5">
				<div className="grid gap-2">
					<AlertDialog.Title className="font-semibold text-2xl text-secondary-12">
						{t("title")}
					</AlertDialog.Title>
					<AlertDialog.Description className="text-neutral-11 text-sm">
						{t("description", { name: firm?.name })}
					</AlertDialog.Description>
				</div>

				<p className="rounded-md bg-error-3 p-3 text-error-11 text-sm">{t("consequences")}</p>

				<div className="flex justify-end gap-2">
					<AlertDialog.Close disabled={isPending} render={<Button variant="default" />}>
						{t("action.cancel")}
					</AlertDialog.Close>
					<Button variant="destructive" disabled={isPending} onClick={handleDelete}>
						{isPending && <Spinner />}
						{t("action.confirm")}
					</Button>
				</div>
			</AlertDialog.Content>
		</AlertDialog>
	);
}
