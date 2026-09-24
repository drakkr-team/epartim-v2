import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";

import ListCompaniesPolicy from "#features/admin/companies/policies/list.policy";
import UpdateCompanyPolicy from "#features/admin/companies/policies/update.policy";
import ListCompaniesService from "#features/admin/companies/services/list.service";
import CompanyPresenter from "#presenters/company.presenter";
import PaginationPresenter from "#presenters/pagination.presenter";
import { PaginationValidator } from "#validators/pagination.validator";

@inject()
export default class ListCompaniesController {
	constructor(
		protected listCompaniesService: ListCompaniesService,
		protected companyPresenter: CompanyPresenter,
		protected paginationPresenter: PaginationPresenter,
	) {}

	async handle({ request, bouncer }: HttpContext) {
		await bouncer.with(ListCompaniesPolicy).authorize("handle");

		const {
			page = 1,
			perPage = 20,
			q,
			orderBy,
		} = await request.validateUsing(ListCompaniesController.querySchema);

		const companies = await this.listCompaniesService
			.handle({ q, orderBy })
			.paginate(page, perPage);

		return {
			meta: {
				...this.paginationPresenter.toJSON(companies),
			},
			data: await Promise.all(
				companies.all().map(async (company) => ({
					...this.companyPresenter.toJSON(company),
					meta: {
						canUpdate: await bouncer.with(UpdateCompanyPolicy).allows("handle"),
					},
				})),
			),
		};
	}

	static querySchema = vine.create({
		...PaginationValidator.getProperties(),
		q: vine.string().optional(),
		orderBy: vine.string().optional(),
	});
}
