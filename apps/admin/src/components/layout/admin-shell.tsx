import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import type { PropsWithChildren } from "react";

import { Button } from "@workspace/ui-react/components/button";
import { Sidebar as UiSidebar } from "@workspace/ui-react/components/sidebar";
import { LayoutDashboardIcon, LogOutIcon, UsersIcon } from "@workspace/ui-react/icons";

import { api } from "#/libs/tuyau";

const navigationItems = [
	{ label: "Tableau de bord", to: "/", icon: LayoutDashboardIcon },
	{ label: "Utilisateurs", to: "/users", icon: UsersIcon },
];

export function AdminShell({ children }: PropsWithChildren) {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { mutate: logout, isPending: isLoggingOut } = useMutation(
		api.admin.authentication.logout.mutationOptions({
			onSuccess: () => {
				queryClient.removeQueries({
					queryKey: api.admin.authentication.viewCurrentUser.pathKey(),
				});
				navigate({ to: "/login" });
			},
		}),
	);

	return (
		<div className="flex min-h-svh bg-brand-shell text-neutral-12">
			<UiSidebar className="w-64 border-r-0 bg-brand-navy text-primary-1">
				<UiSidebar.Header className="px-6 pt-10 pb-4">
					<Link className="inline-flex font-bold text-2xl tracking-[-0.06em]" to="/">
						epartim<span className="text-brand-gold">.</span>
					</Link>
					<p className="mt-1 font-semibold text-brand-gold text-xs uppercase tracking-[0.2em]">
						Administration
					</p>
				</UiSidebar.Header>

				<UiSidebar.Body className="px-4 pt-0 pb-6">
					<nav aria-label="Navigation principale">
						<UiSidebar.Group className="mt-5">
							<UiSidebar.GroupLabel className="font-semibold text-brand-gold text-xs uppercase tracking-[0.2em]">
								Gestion
							</UiSidebar.GroupLabel>
							<div className="mt-2 grid gap-1">
								{navigationItems.map((item) => {
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
					</nav>
				</UiSidebar.Body>

				<UiSidebar.Footer className="px-4 pb-6">
					<Button
						className="w-full justify-start text-primary-6 hover:bg-primary-5/10 hover:text-primary-1"
						disabled={isLoggingOut}
						onClick={() => logout({})}
						variant="ghost"
					>
						<LogOutIcon />
						Déconnexion
					</Button>
				</UiSidebar.Footer>
			</UiSidebar>

			<main className="min-w-0 flex-1 p-4 pt-8 sm:p-8 lg:p-12">{children}</main>
		</div>
	);
}
