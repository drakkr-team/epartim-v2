import { createFileRoute, Outlet } from "@tanstack/react-router";

import type { BreadcrumbStaticData } from "#/libs/breadcrumb";

export const Route = createFileRoute("/(protected)/(operations)/subscriptions")({
	staticData: {
		breadcrumb: { labelKey: "subscriptions", to: "/subscriptions" },
	} satisfies BreadcrumbStaticData,
	component: Outlet,
});
