import router from "@adonisjs/core/services/router";

import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";

router
	.group(() => {
		router.post("/activate", [controllers.features.admin.accountManagement.onboarding.Activate]);
	})
	.use(middleware.guest({ guards: ["admin"] }))
	.prefix("/admin/account_management/onboarding")
	.as("admin.account_management.onboarding");
