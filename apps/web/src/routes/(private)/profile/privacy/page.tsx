import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Card } from "@workspace/ui-react/components/card";

import { DeleteProfileSection } from "#/features/user_management/profile/components/delete-section";
import type { BreadcrumbStaticData } from "#/libs/breadcrumb";

export const Route = createFileRoute("/(private)/profile/privacy/")({
	staticData: {
		breadcrumb: { labelKey: "profile-privacy" },
	} satisfies BreadcrumbStaticData,
	component: Page,
});

function Page() {
	const { t } = useTranslation("routes.(private).profile.privacy");

	return (
		<Card>
			<Card.Header>
				<h2 className="font-semibold text-md text-neutral-12">
					{t("delete-profile-section.title")}
				</h2>
			</Card.Header>
			<Card.Content>
				<DeleteProfileSection />
			</Card.Content>
		</Card>
	);
}
