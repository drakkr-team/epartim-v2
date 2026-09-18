import { Link } from "@tanstack/react-router";
import type { CellContext } from "@tanstack/react-table";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button, ButtonHeadless } from "@workspace/ui-react/components/button";
import { Menu } from "@workspace/ui-react/components/menu";
import {
	EllipsisVerticalIcon,
	SquareArrowOutUpRightIcon,
	SquarePenIcon,
	TrashIcon,
} from "@workspace/ui-react/icons";

import { DeleteRoleDialog } from "#/features/roles/components/delete-dialog";
import type { RoleRow } from "#/features/roles/hooks/use-table";

type RolesTableActionCellProps = {
	cell: CellContext<RoleRow, unknown>;
};

export function RolesTableActionCell({ cell }: RolesTableActionCellProps) {
	const { t } = useTranslation("features.roles.components.table.action-cell");

	const role = cell.row.original;
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	return (
		<>
			<Menu>
				<Menu.Trigger render={<Button variant="ghost" size="icon-md" aria-label={t("actions")} />}>
					<EllipsisVerticalIcon />
				</Menu.Trigger>

				<Menu.Content align="end">
					<Menu.Item render={<Link to="/roles/$roleId" params={{ roleId: role.id.toString() }} />}>
						<SquareArrowOutUpRightIcon />
						{t("show")}
					</Menu.Item>
					{role.meta.canUpdate && (
						<Menu.Item
							render={<Link to="/roles/$roleId/edit" params={{ roleId: role.id.toString() }} />}
						>
							<SquarePenIcon />
							{t("edit")}
						</Menu.Item>
					)}
					{role.meta.canDelete && (
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

			<DeleteRoleDialog role={role} open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} />
		</>
	);
}
