import type { ReactNode } from "react";

interface PageHeaderProps {
	section: string;
	title: string;
	description: string;
	actions?: ReactNode;
}

/**
 * Shared heading for the main content pages of the distributor space.
 */
export function PageHeader(props: PageHeaderProps) {
	const { section, title, description, actions } = props;

	return (
		<header className="border-brand-line border-b pb-4 sm:pb-6">
			<div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
				<div>
					<p className="font-semibold text-brand-gold-strong text-xs uppercase tracking-[0.18em]">
						{section}
					</p>
					<h1 className="mt-3 font-bold text-brand-navy text-xl leading-tight sm:text-3xl">
						{title}
					</h1>
					<p className="mt-2 text-brand-ink-muted text-xs leading-snug sm:text-base">
						{description}
					</p>
				</div>

				{actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
			</div>
		</header>
	);
}
