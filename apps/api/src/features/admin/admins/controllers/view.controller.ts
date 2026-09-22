import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";

import DeleteAdminPolicy from "#features/admin/admins/policies/delete.policy";
import ResendAdminOnboardingPolicy from "#features/admin/admins/policies/resend_onboarding.policy";
import UpdateAdminPolicy from "#features/admin/admins/policies/update.policy";
import ViewAdminPolicy from "#features/admin/admins/policies/view.policy";
import Admin from "#models/admin";
import AdminPresenter from "#presenters/admin.presenter";
import RolePresenter from "#presenters/role.presenter";

@inject()
export default class ViewAdminController {
	constructor(
		protected adminPresenter: AdminPresenter,
		protected rolePresenter: RolePresenter,
	) {}

	async handle({ params, bouncer }: HttpContext) {
		const { adminId } = params;

		await bouncer.with(ViewAdminPolicy).authorize("handle");

		const admin = await Admin.findOrFail(adminId);

		const canUpdatePromise = bouncer.with(UpdateAdminPolicy).allows("handle");
		const canDeletePromise = bouncer.with(DeleteAdminPolicy).allows("handle", adminId);
		const canResendOnboardingPromise = bouncer
			.with(ResendAdminOnboardingPolicy)
			.allows("handle", admin);

		const [canUpdate, canDelete, canResendOnboarding] = await Promise.all([
			canUpdatePromise,
			canDeletePromise,
			canResendOnboardingPromise,
			admin.load("role"),
		]);

		return {
			...this.adminPresenter.toJSON(admin),
			role: this.rolePresenter.toJSON(admin.role),
			meta: {
				canUpdate,
				canDelete,
				canResendOnboarding,
			},
		};
	}
}
