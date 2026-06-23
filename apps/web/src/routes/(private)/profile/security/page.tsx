import { createFileRoute } from "@tanstack/react-router";

import { UpdatePasswordForm } from "#/features/user_management/password/components/update-form";

export const Route = createFileRoute("/(private)/profile/security/")({
	component: Page,
});

function Page() {
	return <UpdatePasswordForm />;
}
