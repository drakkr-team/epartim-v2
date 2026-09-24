import { useNavigate } from "@tanstack/react-router";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { CompanyLegalForm } from "@workspace/api/constants/company";
import type { Company, Pagination } from "@workspace/api/data";

import { useColumnVisibilityStore } from "#/hooks/use-column-visibility-store";
import { orderByToSortingSate, sortingStateToOrderBy } from "#/utils/table";

type CompanyRow = Company & {
	meta: {
		canUpdate: boolean;
	};
};

type UseCompaniesTableParams = {
	data: CompanyRow[];
	pagination: Pagination;
	q?: string;
	orderBy?: string;
};

export function useCompaniesTable(params: UseCompaniesTableParams) {
	const { data, pagination, q, orderBy } = params;

	const { t } = useTranslation("features.companies.hooks.use-table");
	const navigate = useNavigate();
	const sorting = orderByToSortingSate(orderBy);
	const { columnVisibility, setColumnVisibility } = useColumnVisibilityStore({
		name: "companies-table-column-visibility",
		defaultValue: {},
	});

	const columnHelper = createColumnHelper<CompanyRow>();
	const columns = useMemo(
		() => [
			columnHelper.accessor("id", {
				header: t("header.id"),
			}),
			columnHelper.accessor("name", {
				header: t("header.name"),
				cell: (props) => props.getValue() ?? t("value.empty"),
			}),
			columnHelper.accessor("siren", {
				header: t("header.siren"),
				cell: (props) => props.getValue() ?? t("value.empty"),
				enableSorting: false,
			}),
			columnHelper.accessor("siret", {
				header: t("header.siret"),
				cell: (props) => props.getValue() ?? t("value.empty"),
				enableSorting: false,
			}),
			columnHelper.accessor("naf", {
				header: t("header.naf"),
				cell: (props) => props.getValue() ?? t("value.empty"),
				enableSorting: false,
			}),
			columnHelper.accessor("legalForm", {
				header: t("header.legalForm"),
				cell: (props) => {
					const legalForm = props.getValue();
					if (legalForm === null) return t("value.empty");

					const key = Object.entries(CompanyLegalForm).find(
						([, value]) => value === legalForm,
					)?.[0];
					return key ? t(`legalForm.${key}`, { defaultValue: key }) : legalForm.toString();
				},
				enableSorting: false,
			}),
			columnHelper.accessor("companyHeadcount", {
				header: t("header.companyHeadcount"),
				cell: (props) => props.getValue() ?? t("value.empty"),
				enableSorting: false,
			}),
			columnHelper.accessor("vatNumber", {
				header: t("header.vatNumber"),
				cell: (props) => props.getValue() ?? t("value.empty"),
				enableSorting: false,
			}),
			columnHelper.accessor("financialYearClosingDay", {
				header: t("header.financialYearClosingDay"),
				cell: (props) => props.getValue() ?? t("value.empty"),
				enableSorting: false,
			}),
			columnHelper.accessor("createdAt", {
				header: t("header.createdAt"),
				cell: (props) => props.getValue().toLocaleDateString("fr-FR"),
			}),
			columnHelper.accessor("updatedAt", {
				header: t("header.updatedAt"),
				cell: (props) => props.getValue().toLocaleDateString("fr-FR"),
			}),
		],
		[columnHelper, t],
	);

	return useReactTable({
		data,
		columns,
		manualSorting: true,
		manualPagination: true,
		getCoreRowModel: getCoreRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onGlobalFilterChange: (updaterOrValue) => {
			const query = typeof updaterOrValue === "function" ? updaterOrValue(q) : updaterOrValue;

			return navigate({
				to: ".",
				search: (previous) => ({ ...previous, q: query || undefined, page: undefined }),
			});
		},
		onSortingChange: (updaterOrValue) => {
			const nextSorting =
				typeof updaterOrValue === "function" ? updaterOrValue(sorting) : updaterOrValue;

			return navigate({
				to: ".",
				search: (previous) => ({
					...previous,
					orderBy: sortingStateToOrderBy(nextSorting),
					page: undefined,
				}),
			});
		},
		onPaginationChange: (updaterOrValue) => {
			const nextPagination =
				typeof updaterOrValue === "function"
					? updaterOrValue({
							pageIndex: pagination.currentPage - 1,
							pageSize: pagination.perPage,
						})
					: updaterOrValue;

			return navigate({
				to: ".",
				search: (previous: Record<string, unknown>) => ({
					...previous,
					page: nextPagination.pageIndex + 1,
					perPage: nextPagination.pageSize,
				}),
			});
		},
		pageCount: pagination.lastPage,
		initialState: {
			globalFilter: q,
		},
		state: {
			columnVisibility,
			sorting,
			pagination: {
				pageSize: pagination.perPage,
				pageIndex: pagination.currentPage - 1,
			},
		},
	});
}
