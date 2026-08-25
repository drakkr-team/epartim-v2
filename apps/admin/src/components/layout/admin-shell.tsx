import { Link } from "@tanstack/react-router";
import type { PropsWithChildren } from "react";

import { Logo } from "@workspace/ui-react/components/logo";
import { Sidebar as UiSidebar } from "@workspace/ui-react/components/sidebar";
import { Spinner } from "@workspace/ui-react/components/spinner";
import { LayoutDashboardIcon, LogOutIcon, ShieldCheckIcon } from "@workspace/ui-react/icons";

import { useLogoutMutation } from "#/features/account_management/authentication/hooks/use-logout-mutation";

const navigationItems = [
	{ label: "Tableau de bord", to: "/", icon: LayoutDashboardIcon, exact: true },
	{ label: "Administrateurs", to: "/admins", icon: ShieldCheckIcon, exact: false },
] as const;

export function AdminShell({ children }: PropsWithChildren) {
	const { mutateAsync: logout, isPending: isLoggingOut } = useLogoutMutation();

	return (
		<div className="flex min-h-svh text-neutral-12">
			<UiSidebar className="hidden md:grid">
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
												<span
													className={
														isActive
															? "relative flex h-10 w-full items-center gap-3 rounded-md bg-secondary-10 px-3 font-semibold text-primary-9 text-xs before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:rounded-r before:bg-primary-9 [&_svg]:size-5"
															: "flex h-10 w-full items-center gap-3 rounded-md px-3 text-neutral-1/75 text-xs transition-colors hover:bg-secondary-10/50 hover:text-neutral-1 [&_svg]:size-5"
													}
												>
													<Icon aria-hidden="true" />
													{item.label}
												</span>
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

			<div className="min-w-0 flex-1">
				<header className="bg-secondary-9 px-4 py-3 text-secondary-1 md:hidden">
					<div className="flex items-center justify-between gap-3">
						<Logo className="h-8 w-auto" />
						<UiSidebar.Item
							aria-label="Se déconnecter"
							className="w-auto px-3"
							disabled={isLoggingOut}
							onClick={logout}
						>
							{isLoggingOut ? <Spinner /> : <LogOutIcon />}
						</UiSidebar.Item>
					</div>
					<nav aria-label="Navigation principale" className="mt-3 flex gap-2 overflow-x-auto">
						{navigationItems.map((item) => (
							<Link activeOptions={{ exact: item.exact }} key={item.to} to={item.to}>
								{({ isActive }) => (
									<span
										className={
											isActive
												? "inline-flex h-9 items-center gap-2 rounded-md bg-secondary-11 px-3 font-medium text-sm"
												: "inline-flex h-9 items-center gap-2 rounded-md px-3 font-medium text-sm hover:bg-secondary-10"
										}
									>
										<item.icon aria-hidden="true" className="size-4" />
										{item.label}
									</span>
								)}
							</Link>
						))}
					</nav>
				</header>

				<main className="min-w-0 p-4 pt-8 sm:p-8 lg:p-12">{children}</main>
			</div>
		</div>
	);
}
