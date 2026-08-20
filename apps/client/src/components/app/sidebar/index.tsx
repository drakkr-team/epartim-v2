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
		<UiSidebar className="w-64 border-r-0 bg-brand-navy text-primary-1">
			<UiSidebar.Header className="px-6 pt-10 pb-4">
				<Link className="inline-flex font-bold text-2xl tracking-[-0.06em]" to="/client-portfolio">
					epartim<span className="text-brand-gold">.</span>
				</Link>
			</UiSidebar.Header>

			<UiSidebar.Body className="px-4 pt-0 pb-6">
				<nav aria-label={t("navigation.label")}>
					{navigation.map((group) => (
						<UiSidebar.Group className="mt-5" key={group.label}>
							<UiSidebar.GroupLabel className="font-semibold text-brand-gold text-xs uppercase tracking-[0.2em]">
								{group.label}
							</UiSidebar.GroupLabel>
							<div className="mt-2 grid gap-1">
								{group.items.map((item) => {
									const Icon = item.icon;

									return (
										<Link activeOptions={{ exact: true }} key={item.to} to={item.to}>
											{({ isActive }) => (
												<UiSidebar.Item
													active={isActive}
													className={`text-xs ${
														isActive
															? "relative bg-primary-5/15 font-semibold text-brand-gold before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:rounded-r before:bg-brand-gold"
															: "text-primary-6 hover:bg-primary-5/10 hover:text-primary-1 focus-visible:outline-2 focus-visible:outline-brand-gold focus-visible:outline-offset-2"
													}`}
												>
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

			<UiSidebar.Footer className="border-primary-4/15 border-t px-6 py-6">
				<SidebarUserMenu />
			</UiSidebar.Footer>
		</UiSidebar>
	);
}
