import { createFileRoute, Outlet } from "@tanstack/react-router";

import type { BreadcrumbStaticData } from "#/libs/breadcrumb";

export const Route = createFileRoute("/(protected)/(operations)/souscription")({
	staticData: {
		breadcrumb: { labelKey: "subscriptions", to: "/souscriptions" },
	} satisfies BreadcrumbStaticData,
	component: Outlet,
});
