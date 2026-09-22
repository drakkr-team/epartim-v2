import { Link } from "@tanstack/react-router";
import type { CellContext } from "@tanstack/react-table";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { User } from "@workspace/api/data";
import { Button, ButtonHeadless } from "@workspace/ui-react/components/button";
import { Menu } from "@workspace/ui-react/components/menu";
import { Spinner } from "@workspace/ui-react/components/spinner";
import {
	EllipsisVerticalIcon,
	MailIcon,
	SquareArrowOutUpRightIcon,
	SquarePenIcon,
	TrashIcon,
} from "@workspace/ui-react/icons";

import { DeleteUserDialog } from "#/features/users/components/delete-dialog";
import { useResendOnboardingMutation } from "#/features/users/hooks/use-resend-onboarding-mutation";

type UsersTableActionCellProps = {
	cell: CellContext<
		User & { meta: { canUpdate: boolean; canDelete: boolean; canResendOnboarding: boolean } },
		unknown
	>;
};

export function UsersTableActionCell({ cell }: UsersTableActionCellProps) {
	const { t } = useTranslation("features.users.components.table.action-cell");

	const user = cell.row.original;
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const { mutateAsync: resendOnboarding, isPending: isResendingOnboarding } =
		useResendOnboardingMutation();

	const handleResendOnboarding = async () => {
		await resendOnboarding({ params: { userId: user.id } });
	};

	return (
		<>
			<Menu>
				<Menu.Trigger render={<Button variant="ghost" size="icon-md" />}>
					<EllipsisVerticalIcon />
				</Menu.Trigger>

				<Menu.Content align="end">
					<Menu.Item render={<Link to="/users/$userId" params={{ userId: user.id.toString() }} />}>
						<SquareArrowOutUpRightIcon />
						{t("show")}
					</Menu.Item>
					{user.meta.canResendOnboarding && (
						<Menu.Item
							closeOnClick={false}
							onClick={handleResendOnboarding}
							disabled={isResendingOnboarding}
						>
							{isResendingOnboarding ? <Spinner /> : <MailIcon />}
							{t("resendOnboarding")}
						</Menu.Item>
					)}
					{user.meta.canUpdate && (
						<Menu.Item
							render={<Link to="/users/$userId/edit" params={{ userId: user.id.toString() }} />}
						>
							<SquarePenIcon />
							{t("edit")}
						</Menu.Item>
					)}
					{user.meta.canDelete && (
						<Menu.Item
							variant="destructive"
							onClick={() => setDeleteDialogOpen(true)}
							render={<ButtonHeadless />}
							nativeButton
						>
							<TrashIcon />
							{t("delete")}
						</Menu.Item>
					)}
				</Menu.Content>
			</Menu>

			<DeleteUserDialog user={user} open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} />
		</>
	);
}
