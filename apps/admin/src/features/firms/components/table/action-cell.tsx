import { Link } from "@tanstack/react-router";
import type { CellContext } from "@tanstack/react-table";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@workspace/ui-react/components/button";
import { Menu } from "@workspace/ui-react/components/menu";
import {
	EllipsisVerticalIcon,
	SquareArrowOutUpRightIcon,
	SquarePenIcon,
	TrashIcon,
} from "@workspace/ui-react/icons";

import { DeleteFirmDialog } from "#/features/firms/components/delete-dialog";
import type { FirmRow } from "#/features/firms/hooks/use-table";

type FirmsTableActionCellProps = {
	cell: CellContext<FirmRow, unknown>;
};

export function FirmsTableActionCell({ cell }: FirmsTableActionCellProps) {
	const { t } = useTranslation("features.firms.components.table.action-cell");

	const firm = cell.row.original;
	const firmId = firm.id.toString();
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	return (
		<>
			<Menu>
				<Menu.Trigger render={<Button variant="ghost" size="icon-md" />}>
					<EllipsisVerticalIcon />
				</Menu.Trigger>

				<Menu.Content align="end">
					<Menu.Item render={<Link to="/firms/$firmId" params={{ firmId }} />}>
						<SquareArrowOutUpRightIcon />
						{t("show")}
					</Menu.Item>
					{firm.meta.canUpdate && (
						<Menu.Item render={<Link to="/firms/$firmId/edit" params={{ firmId }} />}>
							<SquarePenIcon />
							{t("edit")}
						</Menu.Item>
					)}
					{firm.meta.canDelete && (
						<Menu.Item variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
							<TrashIcon />
							{t("delete")}
						</Menu.Item>
					)}
				</Menu.Content>
			</Menu>

			<DeleteFirmDialog
				firmId={firmId}
				firmName={firm.name}
				origin={""}
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
			/>
		</>
	);
}
