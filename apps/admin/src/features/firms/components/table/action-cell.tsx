import { Link, useLocation } from "@tanstack/react-router";
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

import type { FirmRow } from "#/features/firms/hooks/use-table";

type FirmsTableActionCellProps = {
	cell: CellContext<FirmRow, unknown>;
};

export function FirmsTableActionCell({ cell }: FirmsTableActionCellProps) {
	const { t } = useTranslation("features.firms.components.table.action-cell");
	const firm = cell.row.original;
	const firmId = firm.id.toString();
	const location = useLocation();
	const origin = `${location.pathname}${location.searchStr}`;

	return (
		<Menu>
			<Menu.Trigger
				render={
					<Button variant="ghost" size="icon-md" aria-label={t("actions", { name: firm.name })} />
				}
			>
				<EllipsisVerticalIcon />
			</Menu.Trigger>

			<Menu.Content align="end">
				<Menu.Item
					render={<Link to="/firms/$firmId" params={{ firmId }} search={{ from: origin }} />}
				>
					<SquareArrowOutUpRightIcon />
					{t("show")}
				</Menu.Item>
				{firm.meta.canUpdate && (
					<Menu.Item render={<a href={`/firms/${firmId}/edit`} />}>
						<SquarePenIcon />
						{t("edit")}
					</Menu.Item>
				)}
				{firm.meta.canDelete && (
					<Menu.Item variant="destructive">
						<TrashIcon />
						{t("delete")}
					</Menu.Item>
				)}
			</Menu.Content>
		</Menu>
	);
}
