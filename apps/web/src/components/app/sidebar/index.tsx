import { Sidebar as UiSidebar } from "@workspace/ui-react/components/sidebar";

import { SidebarUserMenu } from "#/components/app/sidebar/user-menu";

export function Sidebar() {
	return (
		<UiSidebar>
			<UiSidebar.Header></UiSidebar.Header>

			<UiSidebar.Body></UiSidebar.Body>

			<UiSidebar.Footer>
				<SidebarUserMenu />
			</UiSidebar.Footer>
		</UiSidebar>
	);
}
