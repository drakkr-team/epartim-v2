import { Avatar } from "@workspace/ui-react/components/avatar";
import { Menu } from "@workspace/ui-react/components/menu";
import { Spinner } from "@workspace/ui-react/components/spinner";
import { LogOutIcon } from "@workspace/ui-react/icons";

import { useLogoutMutation } from "#/features/account_management/authentication/hooks/use-logout-mutation";

export function SidebarUserMenu() {
	const { mutateAsync: logout, isPending: isLoggingOut } = useLogoutMutation();

	return (
		<div className="grid w-full grid-cols-[auto_1fr] items-center gap-2">
			<Menu>
				<Menu.Trigger
					aria-label="Menu utilisateur"
					className="rounded-full outline-none ring-secondary-9 transition hover:brightness-95 focus-visible:ring-3"
				>
					<Avatar className="size-9 bg-secondary-9 font-semibold text-primary-12" size="lg">
						<Avatar.Fallback>EP</Avatar.Fallback>
					</Avatar>
				</Menu.Trigger>

				<Menu.Content align="start" side="right">
					<Menu.Item disabled>Mon profil</Menu.Item>
					<Menu.Item disabled={isLoggingOut} onClick={() => logout({})} variant="destructive">
						{isLoggingOut ? <Spinner /> : <LogOutIcon />}
						Se déconnecter
					</Menu.Item>
				</Menu.Content>
			</Menu>

			<div className="grid text-start">
				<p className="truncate font-semibold text-primary-1 text-sm">Utilisateur</p>
				<p className="truncate text-2xs text-primary-6">utilisateur@epartim.fr</p>
			</div>
		</div>
	);
}
