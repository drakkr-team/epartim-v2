import router from "@adonisjs/core/services/router";

import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";

router
	.group(() => {
		router.get("/", [controllers.features.admin.adminManagement.profile.View]);
	})
	.use(middleware.auth({ guards: ["admin"] }))
	.prefix("admin/admin-management/profile")
	.as("admin.admin_management.profile");
