import { Link } from "@tanstack/react-router";
import type { PropsWithChildren } from "react";

import { Logo } from "@workspace/ui-react/components/logo";
import { Sidebar as UiSidebar } from "@workspace/ui-react/components/sidebar";
import { Spinner } from "@workspace/ui-react/components/spinner";
import { LayoutDashboardIcon, LogOutIcon, UserShieldIcon } from "@workspace/ui-react/icons";

import { useLogoutMutation } from "#/features/account_management/authentication/hooks/use-logout-mutation";

const navigationItems = [
	{ label: "Tableau de bord", to: "/", icon: LayoutDashboardIcon, exact: true },
	{ label: "Administrateurs", to: "/admins", icon: UserShieldIcon, exact: false },
] as const;

export function AdminShell({ children }: PropsWithChildren) {
	const { mutateAsync: logout, isPending: isLoggingOut } = useLogoutMutation();

	return (
		<div className="flex min-h-svh text-neutral-12">
			<UiSidebar>
				<UiSidebar.Header>
					<Logo className="h-12 w-auto text-neutral-1" />
				</UiSidebar.Header>

				<UiSidebar.Body>
					<nav aria-label="Navigation principale">
						<UiSidebar.Group>
							<UiSidebar.GroupLabel>Gestion</UiSidebar.GroupLabel>
							<div className="mt-2 grid gap-1">
								{navigationItems.map((item) => {
									const Icon = item.icon;

									return (
										<Link activeOptions={{ exact: item.exact }} key={item.to} to={item.to}>
											{({ isActive }) => (
												<UiSidebar.Item active={isActive}>
													<Icon />
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

				<UiSidebar.Footer>
					<UiSidebar.Item onClick={logout} disabled={isLoggingOut}>
						{isLoggingOut ? <Spinner /> : <LogOutIcon />}
						Se déconnecter
					</UiSidebar.Item>
				</UiSidebar.Footer>
			</UiSidebar>

			<div className="ml-64 flex-1 p-4 pt-8 sm:p-8 sm:pt-12">{children}</div>
		</div>
	);
}
