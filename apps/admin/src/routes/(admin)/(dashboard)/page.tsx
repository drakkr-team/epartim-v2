import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(admin)/(dashboard)/")({
	component: DashboardPage,
});

function DashboardPage() {
	return (
		<section className="space-y-6">
			<div className="border-primary-12/10 border-b pb-5">
				<p className="font-semibold text-gold-11 text-xs uppercase tracking-[0.18em]">
					Administration
				</p>
				<h1 className="mt-2 font-bold text-4xl text-primary-12 tracking-tight">
					Pilotage de la plateforme
				</h1>
				<p className="mt-2 max-w-2xl text-neutral-11">
					Espace d’administration en cours de construction.
				</p>
			</div>
		</section>
	);
}
