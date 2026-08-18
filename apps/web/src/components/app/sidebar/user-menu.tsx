import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Avatar } from "@workspace/ui-react/components/avatar";
import { Menu } from "@workspace/ui-react/components/menu";
import { Spinner } from "@workspace/ui-react/components/spinner";
import { LogOutIcon, UserIcon } from "@workspace/ui-react/icons";

import { useLogoutMutation } from "#/features/user_management/authentication/hooks/use-logout-mutation";
import { api } from "#/libs/tuyau";

export function SidebarUserMenu() {
	const { t } = useTranslation("components.app.sidebar.user-menu");

	const { data: currentUser } = useSuspenseQuery(api.userManagement.profile.view.queryOptions());

	const { mutate: logout, isPending: isLoggingOut } = useLogoutMutation();
	return (
		<div className="grid w-full grid-cols-[auto_1fr] items-center gap-2">
			<Menu>
				<Menu.Trigger
					aria-label={t("action.profile")}
					className="rounded-full outline-none ring-brand-gold transition hover:brightness-95 focus-visible:ring-3"
				>
					<Avatar className="size-9 bg-brand-gold font-semibold text-brand-navy" size="lg">
						<Avatar.Fallback>{currentUser.name.slice(0, 2).toUpperCase()}</Avatar.Fallback>
					</Avatar>
				</Menu.Trigger>

				<Menu.Content align="start" side="right">
					<Menu.Item nativeButton={false} render={<Link to="/profile" />}>
						<UserIcon />
						{t("action.profile")}
					</Menu.Item>
					<Menu.Item
						variant="destructive"
						closeOnClick={false}
						disabled={isLoggingOut}
						onClick={() => logout({})}
					>
						{isLoggingOut ? <Spinner /> : <LogOutIcon />} {t("action.logout")}
					</Menu.Item>
				</Menu.Content>
			</Menu>

			<div className="grid text-start">
				<p className="truncate font-semibold text-primary-1 text-sm">{currentUser.name}</p>
				<p className="truncate text-2xs text-primary-6">{currentUser.email}</p>
			</div>
		</div>
	);
}
