import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Logo } from "@workspace/ui-react/components/logo";
import { Sidebar as UiSidebar } from "@workspace/ui-react/components/sidebar";
import { FilePenLineIcon, WalletCardsIcon } from "@workspace/ui-react/icons";

import { SidebarUserMenu } from "#/components/app/sidebar/user-menu";

export function Sidebar() {
	const { t } = useTranslation("components.app.sidebar.index");
	const navigation = [
		{
			label: t("navigation.group.operations"),
			items: [
				{
					label: t("navigation.item.client-portfolio"),
					to: "/client-portfolio",
					icon: WalletCardsIcon,
				},
				{
					label: t("navigation.item.subscriptions"),
					to: "/subscriptions",
					icon: FilePenLineIcon,
				},
			],
		},
	];

	return (
		<UiSidebar>
			<UiSidebar.Header>
				<Logo className="h-12 w-auto text-neutral-1" />
			</UiSidebar.Header>

			<UiSidebar.Body>
				<nav aria-label={t("navigation.label")}>
					{navigation.map((group) => (
						<UiSidebar.Group key={group.label}>
							<UiSidebar.GroupLabel>{group.label}</UiSidebar.GroupLabel>
							<div className="mt-2 grid gap-1">
								{group.items.map((item) => {
									const Icon = item.icon;

									return (
										<Link activeOptions={{ exact: true }} key={item.to} to={item.to}>
											{({ isActive }) => (
												<UiSidebar.Item active={isActive}>
													<Icon aria-hidden="true" />
													{item.label}
												</UiSidebar.Item>
											)}
										</Link>
									);
								})}
							</div>
						</UiSidebar.Group>
					))}
				</nav>
			</UiSidebar.Body>

			<UiSidebar.Footer>
				<SidebarUserMenu />
			</UiSidebar.Footer>
		</UiSidebar>
	);
}
