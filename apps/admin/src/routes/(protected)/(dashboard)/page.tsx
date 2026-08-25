import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/(dashboard)/")({
	component: DashboardPage,
});

function DashboardPage() {
	return (
		<section className="space-y-6">
			<div className="border-primary-9 border-b pb-5">
				<p className="font-semibold text-primary-9 text-xs uppercase tracking-widest">
					Administration
				</p>
				<h1 className="mt-2 font-bold text-4xl text-neutral-12 tracking-tight">
					Pilotage de la plateforme
				</h1>
				<p className="mt-2 max-w-2xl text-neutral-11">
					Socle admin dedie aux comptes, invitations, roles, cabinets et reseaux.
				</p>
			</div>
		</section>
	);
}
