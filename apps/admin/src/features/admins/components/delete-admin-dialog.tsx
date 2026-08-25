import { useState } from "react";
import { useTranslation } from "react-i18next";

import { AlertDialog } from "@workspace/ui-react/components/alert-dialog";
import { Button } from "@workspace/ui-react/components/button";
import { Spinner } from "@workspace/ui-react/components/spinner";

import { useDeleteAdminMutation } from "#/features/admins/hooks/use-delete-admin-mutation";
import type { Admin } from "#/features/admins/model";

type DeleteAdminDialogProps = {
	readonly admin: Admin;
	readonly onDeleted?: () => void;
};

export function DeleteAdminDialog({ admin, onDeleted }: DeleteAdminDialogProps) {
	const { t } = useTranslation("features.admins");
	const [open, setOpen] = useState(false);
	const mutation = useDeleteAdminMutation({
		onSuccess: () => {
			setOpen(false);
			onDeleted?.();
		},
	});

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialog.Trigger render={<Button variant="destructive">{t("actions.delete")}</Button>} />
			<AlertDialog.Content className="max-w-lg">
				<AlertDialog.Title className="font-bold text-neutral-12 text-xl">
					{t("delete.title")}
				</AlertDialog.Title>
				<AlertDialog.Description className="mt-2 text-neutral-11 text-sm">
					{t("delete.description", { name: admin.name, email: admin.email })}
				</AlertDialog.Description>
				<p aria-live="polite" className="sr-only" role="status">
					{mutation.isPending ? t("delete.pending") : ""}
				</p>
				<div className="mt-6 flex flex-wrap justify-end gap-2">
					<AlertDialog.Close
						render={
							<Button disabled={mutation.isPending} variant="ghost">
								{t("actions.cancel")}
							</Button>
						}
					/>
					<Button
						disabled={mutation.isPending}
						variant="destructive"
						onClick={() => mutation.mutate({ params: { adminId: admin.id } })}
					>
						{mutation.isPending && <Spinner />}
						{mutation.isPending ? t("delete.pending") : t("actions.confirmDelete")}
					</Button>
				</div>
			</AlertDialog.Content>
		</AlertDialog>
	);
}
