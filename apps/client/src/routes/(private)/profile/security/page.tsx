import { createFileRoute } from "@tanstack/react-router";

import { UpdatePasswordForm } from "#/features/user_management/password/components/update-form";
import type { BreadcrumbStaticData } from "#/libs/breadcrumb";

export const Route = createFileRoute("/(private)/profile/security/")({
	staticData: {
		breadcrumb: { labelKey: "profile-security", to: "/profile/security" },
	} satisfies BreadcrumbStaticData,
	component: Page,
});

function Page() {
	return <UpdatePasswordForm />;
}
