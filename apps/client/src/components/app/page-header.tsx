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
		<header className="border-neutral-4 border-b pb-4 sm:pb-6">
			<div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
				<div>
					<p className="font-bold text-primary-9 text-xs uppercase tracking-widest">{section}</p>
					<h1 className="mt-3 font-bold text-3xl text-secondary-12">{title}</h1>
					<p className="mt-2 text-neutral-11 text-xs leading-snug sm:text-base">{description}</p>
				</div>

				{actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
			</div>
		</header>
	);
}
