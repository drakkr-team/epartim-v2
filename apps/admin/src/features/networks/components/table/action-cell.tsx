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
			<Menu.Trigger
				render={
					<Button variant="ghost" size="icon-md" aria-label={t("menu", { name: network.name })} />
				}
			>
				<EllipsisVerticalIcon />
			</Menu.Trigger>

			<Menu.Content align="end">
				<Menu.Item render={<a href={`/networks/${network.id}`} />}>
					<SquareArrowOutUpRightIcon />
					{t("show")}
				</Menu.Item>
				{network.meta.canUpdate && (
					<Menu.Item render={<a href={`/networks/${network.id}/edit`} />}>
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
