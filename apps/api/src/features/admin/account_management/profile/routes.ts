import router from "@adonisjs/core/services/router";

import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";

router
	.group(() => {
		router.get("/", [controllers.features.admin.accountManagement.profile.View]);
	})
	.use(middleware.auth({ guards: ["admin"] }))
	.prefix("admin/account-management/profile")
	.as("admin.account_management.profile");
