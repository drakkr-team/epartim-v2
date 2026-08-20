import { Link } from "@tanstack/react-router";
import type { PropsWithChildren } from "react";

import { Sidebar as UiSidebar } from "@workspace/ui-react/components/sidebar";
import { LayoutDashboardIcon, UsersIcon } from "@workspace/ui-react/icons";

const navigationItems = [
	{ label: "Tableau de bord", to: "/", icon: LayoutDashboardIcon },
	{ label: "Utilisateurs", to: "/users", icon: UsersIcon },
];

export function AdminShell({ children }: PropsWithChildren) {
	return (
		<div className="flex min-h-svh bg-secondary-2 text-neutral-12">
			<UiSidebar>
				<UiSidebar.Header>
					<Link className="inline-flex font-bold text-2xl tracking-[-0.06em]" to="/">
						epartim<span className="text-secondary-9">.</span>
					</Link>
					<p className="mt-1 font-semibold text-secondary-9 text-xs uppercase tracking-[0.2em]">
						Administration
					</p>
				</UiSidebar.Header>

				<UiSidebar.Body>
					<nav aria-label="Navigation principale">
						<UiSidebar.Group>
							<UiSidebar.GroupLabel>Gestion</UiSidebar.GroupLabel>
							<div className="mt-2 grid gap-1">
								{navigationItems.map((item) => {
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
					</nav>
				</UiSidebar.Body>
			</UiSidebar>

			<main className="min-w-0 flex-1 p-4 pt-8 sm:p-8 lg:p-12">{children}</main>
		</div>
	);
}
