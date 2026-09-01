import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { AlertDialog } from "@workspace/ui-react/components/alert-dialog";
import { Button } from "@workspace/ui-react/components/button";
import { Spinner } from "@workspace/ui-react/components/spinner";

import { useDeleteFirmMutation } from "#/features/firms/hooks/use-delete-mutation";
import { parseFirmListOrigin } from "#/features/firms/utils/list-origin";
import { api } from "#/libs/tuyau";

type DeleteFirmDialogProps = {
	firmId: string;
	firmName: string;
	origin: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export function DeleteFirmDialog(props: DeleteFirmDialogProps) {
	const { firmId, firmName, origin, open, onOpenChange } = props;
	const { t } = useTranslation("features.firms.components.delete-dialog");
	const { mutateAsync: deleteFirm, isPending } = useDeleteFirmMutation(firmName);
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialog.Content className="grid max-w-lg gap-5">
				<div className="grid gap-2">
					<AlertDialog.Title className="font-semibold text-2xl text-secondary-12">
						{t("title")}
					</AlertDialog.Title>
					<AlertDialog.Description className="text-neutral-11 text-sm">
						{t("description", { name: firmName })}
					</AlertDialog.Description>
				</div>

				<p className="rounded-md bg-error-3 p-3 text-error-11 text-sm">{t("consequences")}</p>

				<div className="flex justify-end gap-2">
					<AlertDialog.Close disabled={isPending} render={<Button variant="default" />}>
						{t("action.cancel")}
					</AlertDialog.Close>
					<Button
						className="bg-error-11 hover:not-data-disabled:bg-error-12"
						variant="destructive"
						disabled={isPending}
						onClick={async () => {
							await deleteFirm({ params: { firmId } });
							await navigate({
								to: "/firms",
								search: parseFirmListOrigin(origin) ?? {},
								replace: true,
							});
							await queryClient.refetchQueries({
								queryKey: api.firms.pathKey(),
								type: "active",
							});
						}}
					>
						{isPending && <Spinner />}
						{t("action.confirm")}
					</Button>
				</div>
			</AlertDialog.Content>
		</AlertDialog>
	);
}
