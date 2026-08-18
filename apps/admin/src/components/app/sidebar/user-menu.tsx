import { Button } from "@workspace/ui-react/components/button";
import { Spinner } from "@workspace/ui-react/components/spinner";
import { LogOutIcon } from "@workspace/ui-react/icons";

import { useLogoutMutation } from "#/features/authentication/hooks/use-logout-mutation";

export function SidebarUserMenu() {
	const { mutate: logout, isPending: isLoggingOut } = useLogoutMutation();

	return (
		<Button
			className="w-full justify-start text-primary-6 hover:bg-primary-5/10 hover:text-primary-1"
			disabled={isLoggingOut}
			onClick={() => logout({})}
			variant="ghost"
		>
			{isLoggingOut ? <Spinner /> : <LogOutIcon />}
			Déconnexion
		</Button>
	);
}
