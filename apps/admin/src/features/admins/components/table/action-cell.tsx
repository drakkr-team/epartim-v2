import { Link } from "@tanstack/react-router";
import type { CellContext } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

import type { Admin } from "@workspace/api/data";
import { Button } from "@workspace/ui-react/components/button";
import { Menu } from "@workspace/ui-react/components/menu";
import { Spinner } from "@workspace/ui-react/components/spinner";
import {
	EllipsisVerticalIcon,
	MailIcon,
	SquareArrowOutUpRightIcon,
	SquarePenIcon,
	TrashIcon,
} from "@workspace/ui-react/icons";

import { useResendOnboardingMutation } from "#/features/admins/hooks/use-resend-onboarding-mutation";

type AdminsTableActionCellProps = {
	cell: CellContext<
		Admin & { meta: { canUpdate: boolean; canDelete: boolean; canResendOnboarding: boolean } },
		unknown
	>;
};

export function AdminsTableActionCell({ cell }: AdminsTableActionCellProps) {
	const { t } = useTranslation("features.admins.components.table.action-cell");

	const admin = cell.row.original;

	const { mutateAsync: resendOnboarding, isPending: isResendingOnboarding } =
		useResendOnboardingMutation();

	const handleResendOnboarding = async () => {
		await resendOnboarding({ params: { adminId: admin.id } });
	};

	return (
		<Menu>
			<Menu.Trigger render={<Button variant="ghost" size="icon-md" />}>
				<EllipsisVerticalIcon />
			</Menu.Trigger>

			<Menu.Content align="end">
				<Menu.Item
					render={<Link to="/admins/$adminId" params={{ adminId: admin.id.toString() }} />}
				>
					<SquareArrowOutUpRightIcon />
					{t("show")}
				</Menu.Item>
				{admin.meta.canResendOnboarding && (
					<Menu.Item
						closeOnClick={false}
						onClick={handleResendOnboarding}
						disabled={isResendingOnboarding}
					>
						{isResendingOnboarding ? <Spinner /> : <MailIcon />}
						{t("resendOnboarding")}
					</Menu.Item>
				)}
				{admin.meta.canUpdate && (
					<Menu.Item
						render={<Link to="/admins/$adminId/edit" params={{ adminId: admin.id.toString() }} />}
					>
						<SquarePenIcon />
						{t("edit")}
					</Menu.Item>
				)}
				{admin.meta.canDelete && (
					<Menu.Item variant="destructive">
						<TrashIcon />
						{t("delete")}
					</Menu.Item>
				)}
			</Menu.Content>
		</Menu>
	);
}
