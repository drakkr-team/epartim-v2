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

import { DeleteNetworkDialog } from "#/features/networks/components/delete-dialog";
import type { NetworkRow } from "#/features/networks/hooks/use-table";

type NetworksTableActionCellProps = {
	cell: CellContext<NetworkRow, unknown>;
};

export function NetworksTableActionCell({ cell }: NetworksTableActionCellProps) {
	const { t } = useTranslation("features.networks.components.table.action-cell");

	const network = cell.row.original;
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	return (
		<>
			<Menu>
				<Menu.Trigger render={<Button variant="ghost" size="icon-md" />}>
					<EllipsisVerticalIcon />
				</Menu.Trigger>

				<Menu.Content align="end">
					<Menu.Item
						render={
							<Link to="/networks/$networkId" params={{ networkId: network.id.toString() }} />
						}
					>
						<SquareArrowOutUpRightIcon />
						{t("show")}
					</Menu.Item>
					{network.meta.canUpdate && (
						<Menu.Item
							render={
								<Link
									to="/networks/$networkId/edit"
									params={{ networkId: network.id.toString() }}
								/>
							}
						>
							<SquarePenIcon />
							{t("edit")}
						</Menu.Item>
					)}
					{network.meta.canDelete && (
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

			<DeleteNetworkDialog
				network={network}
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
			/>
		</>
	);
}
