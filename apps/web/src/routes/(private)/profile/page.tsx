import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { UpdateProfileForm } from "#/features/user_management/profile/components/update-form";
import { api } from "#/libs/tuyau";

export const Route = createFileRoute("/(private)/profile/")({
	component: Page,
});

function Page() {
	const { data: currentUser } = useSuspenseQuery(api.userManagement.profile.view.queryOptions());

	return <UpdateProfileForm defaultValues={{ name: currentUser.name }} />;
}
