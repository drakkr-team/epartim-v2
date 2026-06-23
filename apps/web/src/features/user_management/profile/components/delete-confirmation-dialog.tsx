import { useTranslation } from "react-i18next";

import {
	AlertDialog,
	AlertDialogPrimitive,
	type AlertDialogTriggerProps,
} from "@workspace/ui-react/components/alert-dialog";
import { Button } from "@workspace/ui-react/components/button";
import { Spinner } from "@workspace/ui-react/components/spinner";

import { useDeleteProfileMutation } from "#/features/user_management/profile/hooks/use-delete-mutation";

type DeleteProfileConfirmationDialogProps = {
	trigger: AlertDialogTriggerProps["render"];
};

export function DeleteProfileConfirmationDialog(props: DeleteProfileConfirmationDialogProps) {
	const { trigger } = props;

	const { t } = useTranslation(
		"features.user_management.profile.components.delete-confirmation-dialog",
	);

	const alertDialogHandler = AlertDialogPrimitive.createHandle();
	const { mutateAsync: deleteProfile, isPending: isDeleting } = useDeleteProfileMutation();

	const handleDelete = async () => {
		await deleteProfile({});
		alertDialogHandler.close();
	};

	return (
		<AlertDialog handle={alertDialogHandler}>
			<AlertDialog.Trigger render={trigger} />

			<AlertDialog.Content className="sm:max-w-sm">
				<AlertDialog.Title className="mb-1 font-semibold text-lg text-neutral-12">
					{t("title")}
				</AlertDialog.Title>
				<AlertDialog.Description className="mb-8 text-neutral-11 text-sm">
					{t("description")}
				</AlertDialog.Description>

				<div className="flex flex-col justify-end gap-2 sm:flex-row sm:items-center">
					<AlertDialog.Close render={<Button />} disabled={isDeleting}>
						{t("action.cancel")}
					</AlertDialog.Close>
					<Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
						{isDeleting && <Spinner />}
						{t("action.delete")}
					</Button>
				</div>
			</AlertDialog.Content>
		</AlertDialog>
	);
}
