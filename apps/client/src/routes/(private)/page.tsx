import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(private)/")({
	beforeLoad: () => {
		throw redirect({ to: "/client-portfolio" });
	},
});
