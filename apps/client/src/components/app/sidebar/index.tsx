import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

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
					to: "/souscriptions",
					icon: FilePenLineIcon,
				},
			],
		},
	];

	return (
		<UiSidebar>
			<UiSidebar.Header>
				<Link className="inline-flex font-bold text-2xl tracking-[-0.06em]" to="/client-portfolio">
					epartim<span className="text-secondary-9">.</span>
				</Link>
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
