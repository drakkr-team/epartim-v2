import { Link } from "@tanstack/react-router";
import type { CellContext } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

import { Button } from "@workspace/ui-react/components/button";
import { Menu } from "@workspace/ui-react/components/menu";
import {
	EllipsisVerticalIcon,
	SquareArrowOutUpRightIcon,
	SquarePenIcon,
	TrashIcon,
} from "@workspace/ui-react/icons";

import type { NetworkRow } from "#/features/networks/hooks/use-table";

type NetworksTableActionCellProps = {
	cell: CellContext<NetworkRow, unknown>;
};

export function NetworksTableActionCell({ cell }: NetworksTableActionCellProps) {
	const { t } = useTranslation("features.networks.components.table.action-cell");

	const network = cell.row.original;

	return (
		<Menu>
			<Menu.Trigger render={<Button variant="ghost" size="icon-md" />}>
				<EllipsisVerticalIcon />
			</Menu.Trigger>

			<Menu.Content align="end">
				<Menu.Item
					render={<Link to="/networks/$networkId" params={{ networkId: network.id.toString() }} />}
				>
					<SquareArrowOutUpRightIcon />
					{t("show")}
				</Menu.Item>
				{network.meta.canUpdate && (
					<Menu.Item
						render={
							// @ts-expect-error: TypeScript might not infer the correct type for the Link component here
							<Link to="/networks/$networkId/edit" params={{ networkId: network.id.toString() }} />
						}
					>
						<SquarePenIcon />
						{t("edit")}
					</Menu.Item>
				)}
				{network.meta.canDelete && (
					<Menu.Item variant="destructive">
						<TrashIcon />
						{t("delete")}
					</Menu.Item>
				)}
			</Menu.Content>
		</Menu>
	);
}
