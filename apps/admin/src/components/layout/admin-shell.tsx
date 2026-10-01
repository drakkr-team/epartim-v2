import { Link } from "@tanstack/react-router";
import type { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";

import { Logo } from "@workspace/ui-react/components/logo";
import { Sidebar as UiSidebar } from "@workspace/ui-react/components/sidebar";
import { Spinner } from "@workspace/ui-react/components/spinner";
import {
	Building2Icon,
	LayoutDashboardIcon,
	LogOutIcon,
	NetworkIcon,
	ShieldCheckIcon,
	UserShieldIcon,
	UsersIcon,
} from "@workspace/ui-react/icons";

import { useLogoutMutation } from "#/features/account_management/authentication/hooks/use-logout-mutation";

export function AdminShell({ children }: PropsWithChildren) {
	const { t } = useTranslation("components.layout.admin-shell");

	const { mutateAsync: logout, isPending: isLoggingOut } = useLogoutMutation();

	const referenceItems = [
		{ label: t("networks"), to: "/networks", icon: NetworkIcon, exact: false },
		{ label: t("firms"), to: "/firms", icon: Building2Icon, exact: false },
		{ label: t("users"), to: "/users", icon: UsersIcon, exact: false },
	] as const;

	const managementItems = [
		{ label: t("admins"), to: "/admins", icon: UserShieldIcon, exact: false },
		{ label: t("roles"), to: "/roles", icon: ShieldCheckIcon, exact: false },
	] as const;

	return (
		<div className="flex min-h-svh text-neutral-12">
			<UiSidebar>
				<UiSidebar.Header>
					<Logo className="h-12 w-auto text-neutral-1" />
				</UiSidebar.Header>

				<UiSidebar.Body>
					<Link to="/" activeOptions={{ exact: true }}>
						{({ isActive }) => (
							<UiSidebar.Item active={isActive}>
								<LayoutDashboardIcon />
								{t("dashboard")}
							</UiSidebar.Item>
						)}
					</Link>

					<UiSidebar.Group>
						<UiSidebar.GroupLabel>{t("references")}</UiSidebar.GroupLabel>
						<div className="mt-2 grid gap-1">
							{referenceItems.map((item) => {
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

					<UiSidebar.Group>
						<UiSidebar.GroupLabel>{t("management")}</UiSidebar.GroupLabel>
						<div className="mt-2 grid gap-1">
							{managementItems.map((item) => {
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
				</UiSidebar.Body>

				<UiSidebar.Footer>
					<UiSidebar.Item onClick={logout} disabled={isLoggingOut}>
						{isLoggingOut ? <Spinner /> : <LogOutIcon />}
						{t("logout")}
					</UiSidebar.Item>
				</UiSidebar.Footer>
			</UiSidebar>

			<div className="ml-64 flex-1 p-4 pt-8 sm:p-8 sm:pt-12">
				<div className="container mx-auto">{children}</div>
			</div>
		</div>
	);
}
