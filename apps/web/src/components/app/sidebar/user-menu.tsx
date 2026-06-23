import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";

import { Avatar } from "@workspace/ui-react/components/avatar";
import { Menu } from "@workspace/ui-react/components/menu";
import { Spinner } from "@workspace/ui-react/components/spinner";
import {
	ChevronsUpDownIcon,
	LaptopMinimalIcon,
	LogOutIcon,
	MoonIcon,
	PaletteIcon,
	SunIcon,
	UserIcon,
} from "@workspace/ui-react/icons";

import { useLogoutMutation } from "#/features/user_management/authentication/hooks/use-logout-mutation";
import { api } from "#/libs/tuyau";

export function SidebarUserMenu() {
	const { t } = useTranslation("components.app.sidebar.user-menu");

	const { data: currentUser } = useSuspenseQuery(api.userManagement.profile.view.queryOptions());
	const { setTheme, theme } = useTheme();

	const { mutate: logout, isPending: isLoggingOut } = useLogoutMutation();

	return (
		<Menu>
			<Menu.Trigger className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg p-2 outline-none ring-neutral-7 transition hover:bg-neutral-3 focus-visible:ring-3 data-popup-open:bg-neutral-3">
				<Avatar size="lg">
					<Avatar.Fallback>{currentUser.name.slice(0, 2).toUpperCase()}</Avatar.Fallback>
				</Avatar>

				<div className="grid text-start">
					<p className="truncate text-neutral-12 text-sm">{currentUser.name}</p>
					<p className="truncate text-neutral-11 text-xs">{currentUser.email}</p>
				</div>

				<ChevronsUpDownIcon className="size-4 text-neutral-11" />
			</Menu.Trigger>

			<Menu.Content align="end" side="right">
				<Menu.Item nativeButton={false} render={<Link to="/profile" />}>
					<UserIcon />
					{t("action.profile")}
				</Menu.Item>
				<Menu.Submenu>
					<Menu.SubmenuTrigger>
						<PaletteIcon /> {t("action.theme.label")}
					</Menu.SubmenuTrigger>
					<Menu.Content>
						<Menu.RadioGroup value={theme} onValueChange={setTheme}>
							<Menu.RadioItem value="light">
								<SunIcon /> {t("action.theme.light")}
							</Menu.RadioItem>
							<Menu.RadioItem value="dark">
								<MoonIcon /> {t("action.theme.dark")}
							</Menu.RadioItem>
							<Menu.RadioItem value="system">
								<LaptopMinimalIcon /> {t("action.theme.system")}
							</Menu.RadioItem>
						</Menu.RadioGroup>
					</Menu.Content>
				</Menu.Submenu>
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
	);
}
