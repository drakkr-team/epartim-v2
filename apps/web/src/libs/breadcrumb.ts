export interface BreadcrumbStaticData {
	breadcrumb: {
		labelKey: string;
		to?: string;
	};
}

export function getBreadcrumbStaticData(staticData: unknown): BreadcrumbStaticData | undefined {
	if (
		typeof staticData !== "object" ||
		staticData === null ||
		!("breadcrumb" in staticData) ||
		typeof staticData.breadcrumb !== "object" ||
		staticData.breadcrumb === null ||
		!("labelKey" in staticData.breadcrumb) ||
		typeof staticData.breadcrumb.labelKey !== "string"
	) {
		return undefined;
	}

	return staticData as BreadcrumbStaticData;
}
