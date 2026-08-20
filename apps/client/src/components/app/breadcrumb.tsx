import { Link, useMatches } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { getBreadcrumbStaticData } from "#/libs/breadcrumb";

export function Breadcrumb() {
	const { t: tRoute } = useTranslation("routes.(private)");
	const { t } = useTranslation("components.app.breadcrumb");
	const breadcrumbMatches = useMatches({
		select: (matches) =>
			matches.flatMap((match) => {
				const staticData = getBreadcrumbStaticData(match.staticData);

				return staticData
					? [
							{
								id: match.id,
								labelKey: staticData.breadcrumb.labelKey,
								to: staticData.breadcrumb.to,
							},
						]
					: [];
			}),
	});

	return (
		<nav
			aria-label={t("label")}
			className="border-neutral-4 border-b px-4 py-4 sm:px-8 sm:py-5 lg:px-12"
		>
			<ol className="flex flex-wrap items-center gap-y-2 text-base sm:text-xs">
				{breadcrumbMatches.map((match, index) => {
					const isCurrentPage = index === breadcrumbMatches.length - 1;

					return (
						<li className="flex items-center" key={match.id}>
							{index > 0 && (
								<span aria-hidden="true" className="mx-3 text-neutral-9">
									/
								</span>
							)}
							{!isCurrentPage ? (
								<Link
									className="text-neutral-11 transition-colors hover:text-primary-12 focus-visible:outline-2 focus-visible:outline-secondary-9 focus-visible:outline-offset-4"
									to={match.to}
								>
									{tRoute(match.labelKey, match.labelKey)}
								</Link>
							) : (
								<span
									aria-current={isCurrentPage ? "page" : undefined}
									className="font-semibold text-primary-12"
								>
									{tRoute(match.labelKey, match.labelKey)}
								</span>
							)}
						</li>
					);
				})}
			</ol>
		</nav>
	);
}
